sed -i '' "s/app.js/app.js?v=$(date +%s)/g" index.html
sed -i '' "s/style.css/style.css?v=$(date +%s)/g" index.html
