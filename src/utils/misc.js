import * as path from 'path';

const config = require('../../config.js');

// const pageQuery = `{
//   pages: allMdx {
//     edges {
//       node {
//         objectID: id
//         fields {
//           slug
//         }
//         headings {
//           value
//         }
//         frontmatter {
//           title
//           metaDescription
//         }
//         excerpt(pruneLength: 50000)
//       }
//     }
//   }
// }`;

export const isSubpathOf = (base, possibleSubpath) => {
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
