## Purpose
> Describe the problems, issues, or needs driving this feature/fix and include links to related issues in the following format: Resolves issue1, issue2, etc.
> Fixes #

## Checklist

- [ ] **Page addition**
  - [ ] Add `permalink` to pages.

- [ ] **Page removal**
  - [ ] Remove entry from corresponding left nav YAML file.
  - [ ] Add `redirect_from` on the alternative page.
  - [ ] If no alternative page, add redirection on the `redirections.js ` file.

- [ ] **Page rename**
  - [ ] Add front-matter `redirect_from`.
  - [ ] Add front-matter `redirect_to:` (if applicable).

- [ ] **Page restrcuture**
  - [ ] Add `permalink` to pages.
  - [ ] Add front-matter `redirect_from`.
  - [ ] Add front-matter `redirect_to:` (if applicable).
