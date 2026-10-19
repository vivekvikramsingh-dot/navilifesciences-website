#!/bin/zsh
# Publish navilifesciences.com to GitHub Pages (no git needed; uses the GitHub CLI).
#   zsh deploy.sh            -> rebuild, upload, enable Pages (preview at <user>.github.io/<repo>)
#   zsh deploy.sh --domain   -> also attach www.navilifesciences.com (run AFTER the GoDaddy DNS step)
set -e
cd "${0:A:h}"
REPO_NAME=navilifesciences-website
OWNER=$(gh api user -q .login)
REPO="$OWNER/$REPO_NAME"
TMP=$(mktemp -d)

[[ "$1" == "--domain" ]] && cp CNAME.later CNAME   # once attached, CNAME stays so later deploys keep the domain
osascript -l JavaScript build.js "$PWD"
[[ -f CNAME ]] && cp CNAME docs/CNAME

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Creating public repo $REPO ..."
  gh repo create "$REPO_NAME" --public --add-readme \
    --description "Website for Navi Lifesciences Advisory Limited - navilifesciences.com" >/dev/null
  sleep 3
fi

PARENT=$(gh api "repos/$REPO/git/ref/heads/main" -q .object.sha)
echo "Uploading files ..."

find . -type f ! -name '.DS_Store' ! -path './.git/*' ! -path './CNAME' | sed 's#^\./##' | sort | while read -r f; do
  printf '{"encoding":"base64","content":"%s"}' "$(base64 -i "$f" | tr -d '\n')" > "$TMP/blob.json"
  SHA=$(gh api "repos/$REPO/git/blobs" --input "$TMP/blob.json" -q .sha)
  printf '{"path":"%s","mode":"100644","type":"blob","sha":"%s"}\n' "$f" "$SHA" >> "$TMP/entries"
done
printf '{"tree":[%s]}' "$(paste -sd, "$TMP/entries")" > "$TMP/tree.json"
TREE=$(gh api "repos/$REPO/git/trees" --input "$TMP/tree.json" -q .sha)
printf '{"message":"Publish site %s","tree":"%s","parents":["%s"]}' "$(date '+%Y-%m-%d %H:%M')" "$TREE" "$PARENT" > "$TMP/commit.json"
COMMIT=$(gh api "repos/$REPO/git/commits" --input "$TMP/commit.json" -q .sha)
gh api -X PATCH "repos/$REPO/git/refs/heads/main" -f sha="$COMMIT" >/dev/null
echo "Committed $COMMIT"

if ! gh api "repos/$REPO/pages" >/dev/null 2>&1; then
  echo "Enabling GitHub Pages (main /docs) ..."
  gh api -X POST "repos/$REPO/pages" -f 'source[branch]=main' -f 'source[path]=/docs' >/dev/null
fi
if [[ "$1" == "--domain" ]]; then
  gh api -X PUT "repos/$REPO/pages" -f cname=www.navilifesciences.com >/dev/null
  echo "Custom domain set. Once GitHub shows the certificate is ready, run:"
  echo "  gh api -X PUT repos/$REPO/pages -F https_enforced=true"
fi
rm -rf "$TMP"
echo
echo "Done. Site: $(gh api "repos/$REPO/pages" -q .html_url)"
