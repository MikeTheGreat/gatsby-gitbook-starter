import React from 'react';
import styled from '@emotion/styled';
import { MDXProvider } from '@mdx-js/react';

import ThemeProvider from './theme/themeProvider';
import mdxComponents from './mdxComponents';
import Sidebar from './sidebar';
import RightSidebar from './rightSidebar';
import config from '../../config.js';

const Wrapper = styled('div')`
    display: flex;
    justify-content: space-between;
    background: ${({ theme }) => theme.colors.background};

    .sidebarTitle {
        color: ${({ theme }) => theme.colors.heading};
    }

    .sideBarUL li a {
        color: ${({ theme }) => theme.colors.text};
    }

    .sideBarUL .item > a:hover {
        background-color: #1ed3c6;
        color: #fff !important;

        /* background: #F8F8F8 */
    }

    @media only screen and (max-width: 767px) {
        display: block;
    }
`;

const Content = styled('main')`
    display: flex;
    flex-grow: 1;
    margin: 0px 88px;
    padding-top: 3rem;
    background: ${({ theme }) => theme.colors.background};

    table tr {
        background: ${({ theme }) => theme.colors.background};
    }

    @media only screen and (max-width: 1023px) {
        padding-left: 0;
        margin: 0 10px;
        padding-top: 3rem;
    }
`;

const MaxWidth = styled('div')`
    @media only screen and (max-width: 50rem) {
        width: 100%;
        position: relative;
    }
`;

const LeftSideBarWidth = styled('div')`
    width: 298px;
`;

const RightSideBarWidth = styled('div')`
    width: 224px;
`;

const Layout = ({ children, location, existingNav, title }) => (
    <ThemeProvider location={location}>
        <MDXProvider components={mdxComponents}>
            <Wrapper>
                <LeftSideBarWidth className={'hiddenMobile'}>
                    {title ? (
                        <div
                            className={'sidebarTitle sideBarShow'}
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    ) : null}
                    <Sidebar
                        location={location}
                        existingNav={existingNav}
                        propLayout="this is from layout.js"
                    />
                </LeftSideBarWidth>

                <Content>
                    <MaxWidth>{children}</MaxWidth>
                </Content>
                <RightSideBarWidth className={'hiddenMobile'}>
                    <RightSidebar location={location} propRightSide="This is the right sidebar" />
                </RightSideBarWidth>
            </Wrapper>
        </MDXProvider>
    </ThemeProvider>
);

export default Layout;
