import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';

import { Layout, Link } from '$components';
import LayoutCourse from '../components/layoutCourse';
import * as path from 'path';

import NextPrevious from '../components/NextPrevious';
import config from '../../config';
import { Edit, StyledHeading, StyledMainWrapper } from '../components/styles/Docs';

import { StaticQuery } from 'gatsby';

const forcedNavOrder = config.sidebar.forcedNavOrder;

export let byFrontMatterOrder = (a, b) => {
    let a_order =
        a.node.frontmatter.order != null ? a.node.frontmatter.order : Number.MAX_SAFE_INTEGER;

    let b_order =
        b.node.frontmatter.order != null ? b.node.frontmatter.order : Number.MAX_SAFE_INTEGER;

    let result = a_order - b_order;
    return result;
};

export default class MDXRuntimeTest extends Component {
    render() {
        console.log('Hi');
        const { data } = this.props;

        // pages from the src/pages folder don't run the GraphQL query at the bottom of the page
        // so their data is null
        if (!data) {
            return (
                <Layout {...this.props}>
                    <div className={'titleWrapper'}>
                        <StyledHeading>mdx.fields.title</StyledHeading>
                    </div>
                    <StyledMainWrapper>{this.props.children}</StyledMainWrapper>
                </Layout>
            );
        }
        const {
            allMdx,
            mdx,
            site: {
                siteMetadata: { docsLocation, title },
            },
        } = data;

        const gitHub = require('../components/images/github.svg');

        console.log('location slug: ' + this.props.location.pathname);

        let compareCaseInsensitive = (a, b) => {
            let result = a.toLowerCase().localeCompare(b.toLowerCase());
            return result;
        };

        // allMdx.edges
        //     .sort(byFrontMatterOrder)
        //     .map(({ node }) => console.log('After sorting: ' + node.fields.slug));

        const navItems = allMdx.edges
            .sort(byFrontMatterOrder)
            .map(({ node }) => node.fields.slug)
            .filter(slug => slug !== '/') // Include a way to get back to the landing page
            // .sort(compareCaseInsensitive) // initially tried to sort by slug
            .reduce(
                (acc, cur) => {
                    if (forcedNavOrder.find(url => url === cur)) {
                        return { ...acc, [cur]: [cur] };
                    }

                    let prefix = cur.split('/')[1];

                    if (config.gatsby && config.gatsby.trailingSlash) {
                        prefix = prefix + '/';
                    }

                    if (prefix && forcedNavOrder.find(url => url === `/${prefix}`)) {
                        return { ...acc, [`/${prefix}`]: [...acc[`/${prefix}`], cur] };
                    } else {
                        return { ...acc, items: [...acc.items, cur] };
                    }
                },
                { items: [] }
            );

        const nav = forcedNavOrder
            .reduce((acc, cur) => {
                return acc.concat(navItems[cur]);
            }, [])
            .concat(navItems.items)
            .map(slug => {
                if (slug) {
                    const { node } = allMdx.edges.find(({ node }) => node.fields.slug === slug);

                    return { title: node.fields.title, url: node.fields.slug };
                }
            });

        // meta tags
        const metaTitle = mdx.frontmatter.metaTitle;

        const metaDescription = mdx.frontmatter.metaDescription;

        let canonicalUrl = config.gatsby.siteUrl;

        canonicalUrl =
            config.gatsby.pathPrefix !== '/'
                ? canonicalUrl + config.gatsby.pathPrefix
                : canonicalUrl;
        canonicalUrl = canonicalUrl + mdx.fields.slug;

        console.log('In docs.js this.props.pageContext.layout: ' + this.props.pageContext.layout);
        const layout =
            mdx.frontmatter && mdx.frontmatter.layout ? mdx.frontmatter.layout : 'none_specified';
        console.log('Layout from the file: ' + layout);

        const helmet = (
            <Helmet>
                {metaTitle ? <title>{metaTitle}</title> : null}
                {metaTitle ? <meta name="title" content={metaTitle} /> : null}
                {metaDescription ? <meta name="description" content={metaDescription} /> : null}
                {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
                {metaDescription ? (
                    <meta property="og:description" content={metaDescription} />
                ) : null}
                {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
                {metaDescription ? (
                    <meta property="twitter:description" content={metaDescription} />
                ) : null}
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
        );

        switch (layout) {
            default:
            case 'none_specified':
            case 'lesson':
                return (
                    <Layout {...this.props} existingNav={{ allMdx }}>
                        {helmet}
                        <div className={'titleWrapper'}>
                            <StyledHeading>{mdx.fields.title}</StyledHeading>
                            {docsLocation !== 'none' && (
                                <Edit className={'mobileView'}>
                                    <Link
                                        className={'gitBtn'}
                                        to={`${docsLocation}/${mdx.parent.relativePath}`}
                                    >
                                        <img src={gitHub} alt={'Github logo'} /> Edit on GitHub
                                    </Link>
                                </Edit>
                            )}
                        </div>
                        <StyledMainWrapper>
                            <MDXRenderer>{mdx.body}</MDXRenderer>
                        </StyledMainWrapper>
                        <div className={'addPaddTopBottom'}>
                            <NextPrevious mdx={mdx} nav={nav} />
                        </div>
                    </Layout>
                );
            case 'course':
                let isSubpathOf = (base, possibleSubpath) => {
                    let baseParts = path.dirname(base).split(path.sep);
                    // If base was the root dir then use '/' as the path.
                    // Otherwise make sure that '/' is the first item in the path
                    if (baseParts.length === 1 && baseParts[0] === '.') baseParts[0] = '/';
                    else baseParts.unshift('/');

                    let subParts = path.dirname(possibleSubpath).split(path.sep);
                    if (subParts.length === 1 && subParts[0] === '.') subParts[0] = '/';
                    else subParts.unshift('/');

                    if (baseParts.length > subParts.length) return false;
                    for (let iPart = 0; iPart < baseParts.length; iPart++)
                        if (baseParts[iPart] !== subParts[iPart]) return false;

                    return true;
                };
                let lessonPages = {
                    edges: allMdx.edges.filter(
                        ({ node }) =>
                            node.frontmatter.layout === 'lesson' &&
                            isSubpathOf(mdx.parent.relativePath, node.parent.relativePath)
                    ),
                };
                // .map(({ node }) => {
                //     return {
                //         title: node.fields.title,
                //         slug: node.fields.slug,
                //     };
                // });
                debugger;
                return (
                    <LayoutCourse {...this.props} existingNav={{ allMdx: lessonPages }}>
                        {helmet}
                        <h1>hi</h1>
                        <a href="Lesson_01/index">Link to Lesson 01</a>
                        {/* <ul>
                            {lessonPages.map(page => (
                                <li>
                                    <Link to={page.slug} style={{ color: '#Fff' }}>
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
                        </ul> */}
                    </LayoutCourse>
                );
        }
    }
}

export const pageQuery = graphql`
    query($id: String!) {
        site {
            siteMetadata {
                title
                docsLocation
            }
        }
        mdx(fields: { id: { eq: $id } }) {
            fields {
                id
                title
                slug
            }
            body
            tableOfContents
            parent {
                ... on File {
                    relativePath
                }
            }
            frontmatter {
                metaTitle
                metaDescription
                layout
            }
        }
        allMdx {
            edges {
                node {
                    fields {
                        slug
                        title
                    }
                    frontmatter {
                        layout
                        order
                    }
                    parent {
                        ... on File {
                            name
                            relativePath
                        }
                    }
                }
            }
        }
    }
`;

// this actually works with .js pages in the /src/pages folder:
// export default ({ children }) => (
//     <div>
//         <h1>Hi!</h1>
//         {children}
//     </div>
// );
