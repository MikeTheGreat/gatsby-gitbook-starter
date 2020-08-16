const componentWithMDXScope = require('gatsby-plugin-mdx/component-with-mdx-scope');

const path = require('path');

const startCase = require('lodash.startcase');

const config = require('./config');

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    // the following will query for all the md/mdx files and then sort them by abs. path
    // graphql(
    //   `
    //     {
    //       allMdx {
    //         edges {
    //           node {
    //             slug
    //             parent {
    //               ... on File {
    //                 name
    //                 dir
    //                 absolutePath
    //                 relativePath
    //                 relativeDirectory
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   `
    // ).then(result => {
    //   if (result.errors) {
    //     console.log(result.errors); // eslint-disable-line no-console
    //     reject(result.errors);
    //   }

    //   result.data.allMdx.edges.sort(function(a, b) {
    //     let result = a.node.parent.absolutePath
    //       .toLowerCase()
    //       .localeCompare(b.node.parent.absolutePath.toLowerCase());

    //     // console.log(
    //     //   'Sorting - RESULT: ' +
    //     //     result +
    //     //     '\n\t' +
    //     //     a.node.parent.absolutePath +
    //     //     '\n\t' +
    //     //     b.node.parent.absolutePath
    //     // );

    //     return result;
    //   });
    //   // Create blog posts pages.
    //   console.log('Printing out nodes:\n');
    //   result.data.allMdx.edges.forEach(({ node }) => {
    //     console.log(node.parent.absolutePath);
    //   });
    // });

    return new Promise((resolve, reject) => {
        resolve(
            graphql(
                `
                    {
                        allMdx {
                            edges {
                                node {
                                    tableOfContents
                                    fields {
                                        id
                                        slug
                                    }
                                    parent {
                                        ... on File {
                                            name
                                            dir
                                            absolutePath
                                            relativePath
                                            relativeDirectory
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            ).then(result => {
                if (result.errors) {
                    console.log(result.errors); // eslint-disable-line no-console
                    reject(result.errors);
                }

                // Create blog posts pages.
                result.data.allMdx.edges.forEach(({ node }) => {
                    let theSlug = node.fields.slug ? node.fields.slug : '/';
                    let fpTemplate = './src/templates/docs.js';

                    createPage({
                        path: theSlug,
                        component: path.resolve(fpTemplate),
                        context: {
                            id: node.fields.id,
                        },
                    });
                });
            })
        );
    });
};

// from https://www.gatsbyjs.com/docs/creating-and-modifying-pages/
// exports.onCreatePage = ({ page, actions }) => {
//   console.log('onCreatePage: ' + page.path);
//   console.log(page);
// };

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
            alias: {
                $components: path.resolve(__dirname, 'src/components'),
                buble: '@philpl/buble', // to reduce bundle size
            },
        },
    });
};

exports.onCreateBabelConfig = ({ actions }) => {
    actions.setBabelPlugin({
        name: '@babel/plugin-proposal-export-default-from',
    });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;

    if (node.internal.type === `Mdx`) {
        const parent = getNode(node.parent);

        let value = parent.relativePath.replace(parent.ext, '');

        if (value === 'index') {
            value = '';
        }

        if (config.gatsby && config.gatsby.trailingSlash) {
            createNodeField({
                name: `slug`,
                node,
                value: value === '' ? `/` : `/${value}/`,
            });
        } else {
            createNodeField({
                name: `slug`,
                node,
                value: `/${value}`,
            });
        }

        createNodeField({
            name: 'id',
            node,
            value: node.id,
        });

        createNodeField({
            name: 'title',
            node,
            value: node.frontmatter.title || startCase(parent.name),
        });
    }
};
