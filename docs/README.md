# GitHub Pages mirror

This folder is an automatic copy of `studio-site/` used only to publish the
live demo on GitHub Pages (source: branch `arena/01a0dcac-project`, path `/docs`).

The source of truth remains `studio-site/`. To refresh the mirror:

```bash
rm -rf docs && cp -r studio-site docs && cat > docs/README.md  # re-add this note
git add docs && git commit -m "refresh pages mirror" && git push
```
