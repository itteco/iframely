Important restrictions:
    - Dependencies loading not supported.
    - Async errors handling not supported.
    - Result data not supported - direct link change by ref.
    - Timing not supported.

post plugins:
+ get image size
+ check favicon 404
+ grant rels array
+ Filter non string hrefs.
+ resolve links in current domain
+ Filter unique hrefs.
+ Removed http/https duplication
+ remove autoplay: link.href = link.href.replace(/(auto_play)=true/i, '$1=false');

Exact sequence:
+ merge QA rels
+ remove rel thumbnail if has rel image.
+ link.rel = _.compact(_.uniq(link.rel));
+ Skip "deny" links in debug mode.
+ moveMediaAttrs
+ makeMediaResponsive (after moveMediaAttrs)
+ !!!! moveMediaAttr after check image size

TODO:
- sourceId: 'fb' for video_src

hardcode in core:
+ remove canonical links
+ Sort links in order of REL according to CONFIG.REL_GROUPS.

later:
- render html
- safe html
