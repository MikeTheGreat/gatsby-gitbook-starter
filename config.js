const config = {
    gatsby: {
        pathPrefix: '/',
        siteUrl: 'https://hasura.io',
        gaTrackingId: null,
        trailingSlash: false,
    },

    header: {
        logo: 'http://www.cascadia.edu/_resources/images/logo_website_279x120.gif',
        logoLink: 'http://www.cascadia.edu/services/emergency/virtual.aspx',
        title: 'BIT 142',
        githubUrl: '',
        helpUrl: '',
        tweetText: '',
        social: ``,
        links: [{ text: "🔗 Mike's Home Page", link: 'http://faculty.cascadia.edu/mpanitz/' }],
        search: {
            enabled: false,
            indexName: '',
            algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
            algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
            algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
        },
    },
    sidebar: {
        forcedNavOrder: [
            // '/introduction', // add trailing slash if enabled above
            // '/codeblock',
        ],
        collapsedNav: [
            //'/codeblock', // add trailing slash if enabled above
        ],
        links: [{ text: " Mike's Home Page", link: 'http://faculty.cascadia.edu/mpanitz/' }],
        frontline: false,
        ignoreIndex: true,
        title: 'Lesson 01',
    },
    siteMetadata: {
        title: "Mike's Teaching Website",
        description: 'Built with mdx!',
        ogImage: null,
        // if docsLocation is 'none' then do NOT show the 'Edit On GitHub' buttons
        // otherwise use this text as the URL to link to
        docsLocation: 'none', // 'https://github.com/hasura/gatsby-gitbook-boilerplate/tree/master/content',
        favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
    },
    pwa: {
        enabled: false, // disabling this will also remove the existing service worker.
        manifest: {
            name: 'Gatsby Gitbook Starter',
            short_name: 'GitbookStarter',
            start_url: '/',
            background_color: '#6b37bf',
            theme_color: '#6b37bf',
            display: 'standalone',
            crossOrigin: 'use-credentials',
            icons: [
                {
                    src: 'src/pwa-512.png',
                    sizes: `512x512`,
                    type: `image/png`,
                },
            ],
        },
    },
};

module.exports = config;
