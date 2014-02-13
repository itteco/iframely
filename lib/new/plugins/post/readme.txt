Dependencies loading not supported.
Async errors handling not supported.
Result data not supported - direct link change by ref.
Timing not supported.

post plugins:
- render html
+ get image size
- check image 404
- check favicon 404
- meta: unify date
- merge QA rels
- remove rel thumbnail if has rel image.
- remove canonical links
- Skip "deny" links in debug mode.
- moveMediaAttrs
- makeMediaResponsive
- link.rel = _.compact(_.uniq(link.rel)); ?? maybe in core
- link.rel = [link.rel]; ?? maybe in core
- Filter non string hrefs.
- remove autoplay: link.href = link.href.replace(/(auto_play)=true/i, '$1=false');
- resolve links in current domain
+ Filter unique hrefs.
- Removed http/https duplication
- Sort links in order of REL according to CONFIG.REL_GROUPS.
- safe html