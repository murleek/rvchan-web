// var renderText = function(input, id, withHtml) {
// 	if (input == null) return null;
// 	if (!withHtml) input = input.replace(/<([\s\S]+?)>/gm, '&lt;$1&gt;');
// 	return render(input, id).replace(/(\r\n|\n)/gm, "<br>");
// }
// function clearFromRendering(text) {
// 	const formatRules = [
// 		{ replace: "»$1", regex: />>([0-9]+)/gm },
// 		{ replace: '$1&gt;$2', regex: /(^|\s)>([\s\S]+?)$/gm },
// 		{ replace: '$1', regex: /\[b\]([\s\S]+?)\[\/b\]/gm },
// 		{ replace: '$1', regex: /\[i\]([\s\S]+?)\[\/i\]/gm },
// 		{ replace: '$1', regex: /\[s\]([\s\S]+?)\[\/s\]/gm },
// 		{ replace: '$1', regex: /\[sub\]([\s\S]+?)\[\/sub\]/gm },
// 		{ replace: '$1', regex: /\[sup\]([\s\S]+?)\[\/sup\]/gm },
// 		{ replace: '', regex: /\[spoiler\]([\s\S]+?)\[\/spoiler\]/gm },
// 		{ replace: '$1#$2', regex: /(^|\s)#[\s]?([\s\S]+?)$/gm },
// 		{ replace: '$1// $2', regex: /(^|\s)\/\/[\s]?([\s\S]+?)$/gm },
// 		{ replace: '', regex: /\[code\]([\s\S]+?)\[\/code\]/gm },
// 		{ replace: '', regex: /\[mcode\]([\s\S]+?)\[\/mcode\](\n)?/gm },
// 		{ replace: '$3$4', regex: /((https?|ftp):\/\/(\S*?\.\S*?))([\s)\[\]{},;"\':<]|\.\s|$)/gm }
// 	];
// 	text = text;
// 	for (const obj of formatRules) {
// 		if (typeof value === "function")
// 			text = text.replace(obj['regex'], obj['replace']);
// 		else
// 			text = text.replace(new RegExp(obj['regex']), obj['replace']);
// 	}
// 	return text;
// }
// function render(text, id = NaN) {
// 	const formatRules = [
// 		{ replace: reply, regex: />>([0-9]+)/gm },
// 		{ replace: '$1<span id="quote">&gt;$2</span>', regex: /(^|\s)>([\s\S]+?)$/gm },
// 		{ replace: '<b>$1</b>', regex: /\[b\]([\s\S]+?)\[\/b\]/gm },
// 		{ replace: '<i>$1</i>', regex: /\[i\]([\s\S]+?)\[\/i\]/gm },
// 		{ replace: '<s>$1</s>', regex: /\[s\]([\s\S]+?)\[\/s\]/gm },
// 		{ replace: '<sub>$1</sub>', regex: /\[sub\]([\s\S]+?)\[\/sub\]/gm },
// 		{ replace: '<sup>$1</sup>', regex: /\[sup\]([\s\S]+?)\[\/sup\]/gm },
// 		{ replace: '<span id="spoiler" onclick="">$1</span>', regex: /\[spoiler\]([\s\S]+?)\[\/spoiler\]/gm },
// 		{ replace: '$1<span id="comment">#$2</span>', regex: /(^|\s)#[\s]?([\s\S]+?)$/gm },
// 		{ replace: '$1<span id="blue-comment">// $2</span>', regex: /(^|\s)\/\/[\s]?([\s\S]+?)$/gm },
// 		{ replace: '<code class="inline">$1</code>', regex: /\[code\]([\s\S]+?)\[\/code\]/gm },
// 		{ replace: mcode, regex: /\[mcode\]([\s\S]+?)\[\/mcode\](\n)?/gm },
// 		{ replace: '<a href="$1" target="_blank">$3</a>$4', regex: /((https?|ftp):\/\/(\S*?\.\S*?))([\s)\[\]{},;"\':<]|\.\s|$)/gm }
// 	];

// 	function reply(match, p1, p2, p3, offset, string) {
// 		if (id <= p1) return "&gt;&gt;" + p1;
// 		else if (srakaba.posts.find(obj => { return obj.id == p1 })) {
// 			if (id != NaN && srakaba.thread != 0) $('#messages .post#' + p1 + ' #post-replies').append('<a class="post-content-reply" href="javascript:toPost(' + id + ')">»' + id + '</a> ');
// 			return '<a class="post-content-reply" href="javascript:toPost(' + p1 + ')">»' + p1 + (srakaba.thread == p1 ? " (OP)" : "" ) + '</a>';
// 		} else {
// 			var url = apiLink + "/thread-is-exist/index.php";
// 			try {
// 				var jqxhr = $.ajax({url: url, data: { b: srakaba.board, t: p1 }, async: false});
// 				if (jqxhr.status == 200) return '<a class="post-content-reply" href="?board=' + srakaba.board + '&thread=' + p1 + '">»' + p1 + " →" + '</a>';
// 			} catch {}
// 		}
// 		return "&gt;&gt;" + p1;
// 	}
// 	function mcode(match, p1, p2, p3, offset, string) {
// 		var out = p1.split("\r\n");
// 		for (var i = 0; i < out.length; i++) 
// 			out[i] = '<div class="line" onclick="">' + (out[i] != "" ? out[i] : "‏‏‎&#160") + '</div>';

// 		return "<pre class=\"code\">" + out.join('') + "</pre>";
// 	}
// 	text = "\n" + text + "\n";
// 	for (const obj of formatRules) {
// 		if (typeof value === "function")
// 			text = text.replace(obj['regex'], obj['replace']);
// 		else
// 			text = text.replace(new RegExp(obj['regex']), obj['replace']);
// 	}

// 	return text.trim();
// }

const isHTMLTagName = /^[A-Z]/;
const nodeNameToType = (nodeName) => isHTMLTagName.test(nodeName) ? nodeName.toLowerCase() : nodeName;
const types = ["bold", "italic", "strike", "sub", "sup", "spoiler", "quote", "code", "reply", "link"];

const nodesToElements = (nodeList) => {
    const tree = [];
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        // Only render element nodes and text nodes.
        if (node.nodeType === "el") {
            let type = nodeNameToType(node.nodeName);
            if (!types.contains(type)) {
                tree.push(node.textContent);
                continue;
            }
            const children = nodesToElements(node.childNodes, options);
            tree.push(
                React.isValidElement(type)
                    ? React.cloneElement(type, props, children)
                    : React.createElement(type, props, children)
            );
        } else if (node.nodeType === "text") {
            // Handle trim option to remove whitespace text nodes.
            if (node.textContent.trim() !== '') {
                tree.push(node.textContent);
            }
        }
    }
    return tree.length > 0 ? tree : null;
};

export default nodesToElements;  