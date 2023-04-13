# regex-match

This is a custom action that matches a regex against a string.

It was copied from https://github.com/actions-ecosystem/action-regex-match

## Building

The action code used at CI time is in `dist`. The source code is in `src`. The action should be compiled manually when changed. `dist` is checked into git so the action action can be used on GH Actions without needing to to install node_modules.

To compile from `src` to `dist`:

```sh
pnpm run compile-actions
```

## Usage

> This is adapted from the `actions-ecosystem/action-regex-match` README.

GitHub Actions natively supports some helpful functions, like `contains` and `startsWith`, but doesn't support regex matching. This actions provides regexes as an action.


## Inputs

|  NAME   |                 DESCRIPTION        |   TYPE   | REQUIRED | DEFAULT |
| ------- | ---------------------------------- | -------- | -------- | ------- |
| `text`  | The target for `inputs.regex`.     | `string` | `true`   |         |
| `regex` | A regex for `inputs.text`.         | `string` | `true`   |         |
| `flags` | Regex flags e.g. `'g'`, `'gm'`     | `string` | `false`  | `''`    |

## Outputs

|   NAME   |                                          DESCRIPTION                                           |   TYPE   |
| -------- | ---------------------------------------------------------------------------------------------- | -------- |
| `match`  | The whole matched text. If the `inputs.regex` doesn't match `inputs.text`, this value is `'""`. | `string` |
| `group1` | 1st capture group.                                                                        | `string` |
| `group2` | 2nd capture group.                                                                        | `string` |
| `group3` | 3rd capture group.                                                                        | `string` |
| `group4` | 4th capture group.                                                                        | `string` |
| `group5` | 5th capture group.                                                                        | `string` |
| `group6` | 6th capture group.                                                                        | `string` |
| `group7` | 7th capture group.                                                                        | `string` |
| `group8` | 8th capture group.                                                                        | `string` |
| `group9` | 9th capture group.                                                                        | `string` |

## Example

```yaml
name: Add Label with Comment

on: [issue_comment]

jobs:
  create_comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: actions-ecosystem/action-regex-match@v2
        id: regex-match
        with:
          text: ${{ github.event.comment.body }}
          regex: '^/label\s*(.*?)\s*$'

      - uses: actions-ecosystem/action-add-labels@v1
        if: ${{ steps.regex-match.outputs.match != '' }}
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          labels: ${{ steps.regex-match.outputs.group1 }}
```

```yaml
name: Create Comment with Regex Match

on: [issue_comment]

jobs:
  create_comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: actions-ecosystem/action-regex-match@v2
        id: regex-match
        with:
          text: ${{ github.event.comment.body }}
          regex: '```typescript([\s\S]*)```'
          flags: gm

      - uses: actions-ecosystem/action-create-comment@v1
        if: ${{ steps.regex-match.outputs.match != '' }}
        with:
          github_token: ${{ secrets.github_token }}
          body: |
            Hello, @${{ github.actor }}!

            The raw TypeScript code is here.

            ---

            ${{ steps.regex-match.outputs.group1 }}

            ---
```

## License

Based on Action Regex Match, Copyright 2020 The Actions Ecosystem Authors.

Action Regex Match is released under the [Apache License 2.0](./LICENSE).
