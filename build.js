
const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

// Configure marked to properly handle HTML
marked.use({
    breaks: false,
    gfm: true,
    pedantic: false,
    mangle: false,
    headerIds: false
});

// Function to fix indentation issues in SVG blocks
function preprocessMarkdown(markdown) {
    // Find all SVG blocks and remove internal indentation
    return markdown.replace(/(<svg[\s\S]*?<\/svg>)/g, (match) => {
        // Split into lines
        const lines = match.split('\n');
        // Find minimum indentation (excluding empty lines and first line)
        let minIndent = Infinity;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().length > 0) {
                const indent = line.match(/^(\s*)/)[1].length;
                minIndent = Math.min(minIndent, indent);
            }
        }
        // Remove the minimum indentation from all lines except the first
        if (minIndent < Infinity && minIndent > 0) {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].length >= minIndent) {
                    lines[i] = lines[i].substring(minIndent);
                }
            }
        }
        return lines.join('\n');
    });
}

async function main() {
    console.log('Starting build...');
    const files = await fs.readdir('.');
    const mdFiles = files
        .filter(file => file.endsWith('.md'))
        .sort();

    let htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>皮肤屏障修复 - 从颜值事故到美丽故事</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            display: flex;
        }
        #toc {
            width: 280px;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            background: #f8f9fa;
            border-right: 1px solid #dee2e6;
            padding: 20px;
            overflow-y: auto;
            box-sizing: border-box;
        }
        #toc h2 {
            font-size: 1.2em;
            margin-top: 0;
        }
        #toc ul {
            list-style: none;
            padding: 0;
        }
        #toc li a {
            text-decoration: none;
            color: #495057;
            display: block;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.9em;
        }
        #toc li a:hover, #toc li a.active {
            background-color: #e9ecef;
            color: #000;
        }
        #content {
            margin-left: 300px;
            padding: 20px 40px;
            max-width: 800px;
        }
        h1, h2, h3 {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        img, svg {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        code {
            background-color: #eee;
            padding: 2px 4px;
            border-radius: 3px;
        }
        pre {
            background-color: #f8f8f8;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <nav id="toc">
        <h2>目录</h2>
        <ul>
`;

    const chapterTitles = [];
    for (const file of mdFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const match = content.match(/^#\s(.+)/m);
        const title = match ? match[1] : path.basename(file, '.md');
        const anchor = `ch-${path.basename(file, '.md')}`;
        chapterTitles.push({ anchor, title });
        htmlContent += `<li><a href="#${anchor}">${title}</a></li>`;
    }

    htmlContent += `
        </ul>
    </nav>
    <main id="content">
`;

    for (let i = 0; i < mdFiles.length; i++) {
        const file = mdFiles[i];
        const anchor = chapterTitles[i].anchor;
        let markdown = await fs.readFile(file, 'utf-8');
        // Preprocess markdown to fix SVG indentation
        markdown = preprocessMarkdown(markdown);
        const chapterHtml = marked.parse(markdown);
        htmlContent += `<div id="${anchor}">${chapterHtml}</div>`;
    }

    htmlContent += `
    </main>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const links = document.querySelectorAll('#toc a');
            const sections = document.querySelectorAll('#content div[id]');
            
            function changeActiveLink() {
                let index = sections.length;
                while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
                
                links.forEach((link) => link.classList.remove('active'));
                if (index >= 0) {
                    links[index].classList.add('active');
                }
            }

            changeActiveLink();
            window.addEventListener('scroll', changeActiveLink);
        });
    </script>
</body>
</html>
`;

    await fs.writeFile('index.html', htmlContent);
    console.log('Build finished successfully. index.html created.');
}

main().catch(console.error);
