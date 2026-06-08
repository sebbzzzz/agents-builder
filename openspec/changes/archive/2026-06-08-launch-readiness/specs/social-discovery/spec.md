## ADDED Requirements

### Requirement: Metadata base is set to the production origin
The system SHALL define `metadataBase` in the root metadata as the production origin so that all relative OG and canonical URLs resolve to absolute URLs that scrapers can fetch.

#### Scenario: Relative OG image resolves to absolute
- **WHEN** the page metadata declares an OG image with a root-relative path
- **THEN** the rendered `og:image` is an absolute URL on the production origin

### Requirement: Shared links render a rich preview card
The system SHALL provide an OG image sized 1200×630 and the metadata needed for major platforms (Open Graph and Twitter) to render a large-image preview card when the app's URL is shared.

#### Scenario: Open Graph card has an image
- **WHEN** the app URL is shared on a platform that reads Open Graph tags
- **THEN** the preview shows the 1200×630 image, the "groundwork" title, and the description

#### Scenario: Twitter renders a large image card
- **WHEN** the app URL is shared on X/Twitter
- **THEN** the `twitter:card` is `summary_large_image` and the large image, title, and description are shown

#### Scenario: Open Graph identifies the site and canonical URL
- **WHEN** a scraper reads the page metadata
- **THEN** `og:url` and `og:site_name` are present and a canonical URL is declared

### Requirement: Search engines can crawl and index the app
The system SHALL serve a `robots.txt` that allows crawling and references the sitemap, and a `sitemap.xml` listing the public routes.

#### Scenario: robots.txt allows indexing and points to the sitemap
- **WHEN** a crawler requests `/robots.txt`
- **THEN** the response allows crawling of public routes and includes the sitemap URL

#### Scenario: sitemap lists the public routes
- **WHEN** a crawler requests `/sitemap.xml`
- **THEN** the response lists the canonical URL of the home route
