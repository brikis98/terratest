# Terratest website

This is the code for the [Terratest website](https://terratest.gruntwork.io).

Terratest website is built with Jekyll and published on Github Pages from `docs` folder on `master` branch.

# Quick Start

## Download project

Clone or fork Terratest [repository](https://github.com/gruntwork-io/terratest).

## Run

1. Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/). Version 2.4 or above is recommended.
   Consider using [rbenv](https://github.com/rbenv/rbenv) to manage Ruby versions.

2. Install `bundler`:

    ```bash
    gem install bundler
    ```

3. Go to the `docs` folder:

    ```bash
    cd docs
    ```

4. Install gems:

    ```bash
    bundle install
    ```

5. Run the docs site locally:

    ```bash
    bundle exec jekyll serve
    ```

# Deployment

GitHub Pages automatically rebuilds the website from the `/docs` folder whenever you commit and push changes to the `master`
branch.

# Working with the documentation

We recommend updating the documentation *before* updating any code (see [Readme Driven
Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html)). This ensures the documentation
stays up to date and allows you to think through the problem at a high level before you get lost in the weeds of
coding.

The Terratest website contains two collections: *Docs* and *Examples*. They are stored respectively in `_docs` and `_examples` directories.

When you work with the documentation, it's good to preview the changes. To do that, run project as it is described in [Run section](#run).

1. [A) Change content on the existing page](#change-content-on-the-existing-page)
2. [B) Add a new page](#add-a-new-page)
3. [C) Remove or rename page](#remove-or-rename-page)
4. [D) Add custom redirection](#add-custom-redirection)
5. [Update navigation](#update-navigation)
  5.1 [Navigation partials](#navigation-partials)

## A) Change content on the existing page

1. Find page in `_docs` or `_examples` by file name (it's the same as page's title).
2. Edit content and save file.

## B) Add a new page

1. Create a new file in `_docs` or `_examples`. The file's name and title have to be the same.
2. At the beginning of the file, add:

```
---
layout: collection-browser-doc                  # X Cannot be changed
title: Quick start                              # <--- Change this
categories:
  - getting-started                             # <--- Change this if needed
excerpt: Learn how to work with Terratest.      # <--- Change page description
tags: ["Quick Start", "DRY", "backend", "CLI"]  # <--- Set tags
order: 100                                      # <--- It sorts the docs on the list
nav_title: Documentation
nav_title_link: /docs/
---

```

* `layout` - do not change! (Layout sets components like a navigation sidebar, page header, footer, etc.)
* `title` - document title
* `categories` - the document's category. Four categories are in use for now: "getting-started", "testing-best-practices", "alternative-testing-tools", and "community".
* `excerpt` - description. Try to keep it short.
* `tags` - check other posts to see common tags, but you can set a new as well.
* `order` - it is used to sort the documents within collection.
* `nav_title` - the title displayed above navigation. It's optional and it's recommended to use the same as other files in the collection.
* `nav_title_link` - it is URL. If it is set, the `nav_title` becomes a link with a given URL.

3. Add content at the end of the file.
4. If it is another example, you may want to add it to the table on the `/examples/` subpage. Open `_pages/examples/index.html` and add a new row in the table (`<tr>`).

## C) Remove or rename page

1. Find page in `_docs` or `_examples` by file name (it's the same as page's title).
2. Delete page or rename.
3. If it is an `examples`, remove or rename corresponding table's row in `_pages/examples/index.html`.

## D) Add custom redirection

To add link to any page, including subpages outside of any collection, you can create a new file in specific collection (`_docs` or `_examples`), and set following content in the file:

```
---
title: Support
categories: Community
excerpt: Need help?
tags: ["support"]
redirect_to:
  - /support
order: 301
---
```


## Navigation

The navigation sidebar is built in `_includes/collection_browser/navigation/_collection_toc.html`.

First, the script groups documents of the given collection by categories. The categories makes the uppermost level in the navigation sidebar.
Then, within each category, the script adds documents titles to the navigation under specific categories. Documents are sorted by `order` field set in frontmatter section.
Next, headings from each document are being extracted and added to the navigation.

The Collection Browser allows to embed another collection. To do that, add a new file within the main collection and set: `as_nested_collection`, `as_nested_collection_link`.
To learn more about embedding collections, check out how `examples` collection is injected into `docs` collection. It is done with one file: `_docs/01_getting-started/examples.md`.


# Development

## Project structure
```
|-- _docs                     # docs *collection*
|-- _examples                 # examples *collection*
|-- _includes                 # partials
|-- _layouts                  # layouts
|-- _pages                    # static pages
| |-- 404                     # "404: Not found" page
| |-- cookie-policy           # "Cookie Policy" page
| |-- docs                    # index page for *_docs* collection
| |-- index                   # home page
| |-- examples                # index page for *_examples* collection
|
|-- _posts                    # Posts collection - empty and not used
|-- _site                     # website generated by Jekyll
|-- assets                    # Javascript, Stylesheets, and images
|-- scripts                   # useful scripts to use in development
| |-- convert_md_to_adoc      # contains the command to convert MD files to ADOC
|
|-- Gemfile
|-- _config.yml               # Jekyll configuration file
```

## Documentation and Examples collections

The [*documentation*](https://terratest.gruntwork.io/docs) and [*examples*](https://terratest.gruntwork.io/examples) are implemented as Jekyll collections, and both are built with [*Collection Browser*](#collection-browser).

### Documentation collection

The index page of the *Docs* collection is in: `_pages/docs/index.html` and is available under `/docs` URL. It uses *Collection browser* from `_includes/collection_browser/browser` which makes the list of docs, adds search input with tag filter and puts navigation sidebar containing collection's categories.

Collection is stored in `_docs` folder.

### Examples collection

The index page of the *Examples* collection is in: `_pages/examples/index.html` and is available under `/examples` URL. The collection's index page is built in `_pages/examples/index.html`. The *Collection browser* from `_includes/collection_browser/browser` is used to build a _show_ page of each document within a collection.

Collection is stored in `_examples` folder.

## Adding new pages to collections

The *Docs* and *Examples* collections uses *collection browser* which requires to setup proper meta tags in the doc file.

1. Create a new file in collection folder. *Docs* add to the `_docs`, and *Examples* add to `_examples`.
```
---
layout: collection-browser-doc
title: CLI options  # CHANGE THIS
categories:
  - getting-started # CHANGE THIS
excerpt: >- # CHANGE THIS
  Terratest example description
tags: ["CLI"] # CHANGE THIS
order: 102 # CHANGE THIS
nav_title: Documentation # OPTIONAL
nav_title_link: /docs/ # OPTIONAL
---
```

* layout - always has to be: `collection-browser-doc` [DO NOT CHANGE]
* title - the doc title.
* categories - set one category. Use downcase with dashes, e.g. `getting-started`.
* excerpt - the doc description.
* tags - doc tags.
* order - it is use to list documents in the right order. "Getting Started" starts from 100, "Features" starts from 200, and "Community" starts from 300.
* nav_title - the title above navigation. It's optional. It's a link if `nav_title_link` is set.
* nav_title_link - it is a URL. If it is set, `nav_link` is transformed to the link.

2. If you added a new `example`, you may want to add it to the list of examples on main `/examples` subpage. To do that, open `_pages/examples/index.html` and add a new row in table.

## Adding new collections

To add a new collection based on *Collection browser*, like *Docs* and *Examples* collections:

1. Add collection to the `_config.yml`:
```
collections:
  my-collection:   # --> Change to your collection's name
    output: true
    sort_by: order
    permalink: /:collection/:categories/:title/  # --> You can adjust this to your needs. You can remove ":categories" if your collection doesn't use it.
```
2. Create a folder for collection in root directory, e.g: `_my-collection` (change name)
3. Add documents to the `_my-collection` folder and set proper meta tags (see: [Adding new docs to collections](#adding-new-docs-to-collections)).
4. Create folder for collection's index page in `_pages`. Use collection name, e.g: `_pages/my-collection`.
5. Add `index.html` file to newly create folder:
```
---
layout: collection-browser # DO NOT CAHNGE THIS
title: Use cases
subtitle: Learn how to work with Terratest.
excerpt: Learn how to work with Terratest.
permalink: /examples/
slug: examples
nav_title: Documentation # OPTIONAL
nav_title_link: /docs/ # OPTIONAL
---

{% include collection_browser/browser.html collection=site.examples collection_name='examples' %}
```
6. Change `title`, `subtitle`, `excerpt`, `permalink`, and `slug` in meta tags.
7. In `include` statement, set `collection` to your collection set in `_config.yml` and set `collection_name`.


## Collection Browser

_The Collection Browser is strongly inspired by implementation of `guides` on *gruntwork.io* website._

The Collection Browser's purpose is to wrap Jekyll collection into:
* _index_ page containing ordered list of docs with search form,
* _show_ pages presenting docs' contents, and containing navigation sidebar,
* and build navigation sidebar.

### Usage

1. Add collection to `_config.yml`
```
collections:
  my-collection:   # --> Change to your collection's name
    output: true
    sort_by: order
    permalink: /:collection/:categories/:title/  # --> You can adjust this to your needs. You can remove ":categories" if your collection doesn't use it.
```
2. Create a folder for collection in root directory: `_my-collection`
3. Add documents (`.md` format is recommended) to the `_my-collection` folder.
4. In each document add:
```
---
layout: collection-browser-doc  # <-- It has to be "collection-browser-doc"
title: CLI options              # <-- [CHANGE THIS] doc's title
categories:                     # <-- [CHANGE THIS] use single category. (Downcase and dashes instead of spaces)
  - getting-started
excerpt: >-                     # <-- [CHANGE THIS] doc's description
  Some description.
tags: ["CLI", "Another tag"]    # <-- [CHANGE THIS] doc's tags
order: 102                      # <-- [CHANGE THIS] set different number to each doc to set right order
---
```
5. Create `index` page for collection. Create folder with collection name in `_pages`: `my-collection`
6. Add `index.html` in `_pages/my-collection`:
```
---
layout: collection-browser         # <-- It has to be "collection-browser"
title: Use cases
subtitle: Learn how to work with Terratest.
excerpt: Learn how to work with Terratest.
permalink: /use-cases/
slug: use-cases
---

{% include collection_browser/browser.html collection=site.my-collection collection_name='my-collection' %}
```
Adjust meta tags and replace `my-collection` with your collection name in `{% include ... %}`

### How it works

The Collection Browser needs the _index_ page in `_pages` folder. It basically imports `browser.html` from `_includes/collection_browser`.
Meta tags, like `title`, `subtitle`, `excerpt`, are used by Collection Browser on _index_ page. The _index_ page is then published under URL assigned to `permalink`.

The _index_ page displays the list of collection's docs. Clicking on any of them, redirects user to the collection's doc page.

#### config.yml

Collections are registered in the `_config.yml` file like other typical Jekyll collections.
Additional field used in the configuration is: `sort_by: order`. It ensures that collection's documents are displayed in the right order.
The `order` is set then in every collection document. For large collections it's recommended to split files into several folders, and then to use 3-digit numbers. So each folder would have reserved range of numbers, like: `100 - 199`, `200-299`, etc. It makes easy to add new documents without overwriting `order` fields in other docs.

#### Layouts

The Collection Browser uses two layouts:
* `_layouts/collection-browser.html` - for the _index_ page containing the list of documents
* `_layouts/collection-browser-doc.html` - for the "_show_" page of collection's doc

#### Includes

All Collection Browser partials are stored in `_includes/collection_browser`.
* `browser.html` - it is the collection's _index_ page
* `_doc-page.html` - is a starting point for collection's document pages (_show_ pages)

Some includes may use partials from `_includes` directory. For example, `_includes/collection_browser/_cta-section.html` uses `_includes/links-n-built-by.html`.

#### Assets

Names of assets used by `collection-browser` in `assets` folder start with `collection-browser`.

Collection Browser's classes in stylesheets starts mostly with `cb`, `collection-browser` and `collection-browser-doc`.

Javascript files used by  Collection Browser:
* `collection-browser_scroll.js` - responsible for the scroll spying in navigation sidebar and sticking this bar at the top of the screen when page is being scrolled.
* `collection-browser_search.js` - responsible for handling text search and tag filters.
* `collection-browser_toc.js` - responsible for opening and closing navigation sidebar on the document page.

#### Navigation Sidebar

The navigation sidebar is built in `_includes/collection_browser/navigation/_collection_toc.html`. Read more: see: [Navigation](#navigation)

## Markdown (md) > AsciiDoc (adoc) converter

Recommended format of documents is Github Markdown (`.md`). If you use the Markdown format (`.md`), and you want to convert to AsciiDoc format, you can do this with *Pandoc*:

1. Create `input.md` file and paste there Markdown content
2. Run:
```
$ pandoc --from=gfm --to=asciidoc --wrap=none --atx-headers  input.md > output.adoc
```
3. The converted content in `.adoc` format is printed in `output.adoc`

You can use also `scripts/convert_md_to_adoc.sh`.

## AsciiDoc (adoc) > Markdown (md) converter

To convert from `.adoc` (AsciiDoc) format to Markdown, you need *AsciiDoctor* and *Pandoc*.

First, install Asciidoctor:
```
$ sudo apt-get install asciidoctor
```

Next, install Pandoc:
https://pandoc.org/installing.html

Then you can use script: `scripts/convert_adoc_to_md.sh` or use the command:

```
$ asciidoctor -b docbook input.adoc && pandoc -f docbook -t gfm input.xml -o output.md --wrap=none --atx-headers
```

In both cases:
1. create a file: `input.adoc`,
2. add content to the file,
3. run script or command,
4. The output can be found in `output.md`.