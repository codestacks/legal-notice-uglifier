# Legal Notice Uglifier

Want to keep your personal information save against crawler and bot access?
Try out this uglifing tool, just insert your information line by line and
copy the resulting HTML code to your document.

You can use the index.html tool to create your uglified information or just use
the script by your self.

## How to use the Script

First stept would be to get the script.

	<script type="text/javascript" src="js/legal-notice-uglifier.js"></script>

Second step would be to use it.

	<script type="text/javascript">
		var information = [
			"Lorem ipsum dolor sit amet",
			"consetetur sadipscing elitr",
			"sed diam nonumy eirmod"
		];
		var paranoid = false; // disables text selection
		var breakLines = false; // line breaks in source code

		var result = generateLegalNotice(
			information,
			paranoid,
			breakLines
		);

		// result.style contains all style cheats
		// result.container is the name of the target container
		// result.script will be the javascript
		// result.full contains a full code block

		document.write(result.full);
	</script>

## Demo

Take a look at https://blog.codestack.de/legal-notice-uglifier
