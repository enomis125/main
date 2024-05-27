echo "Switching to branch main"
git checkout main

echo "Building app...."
npm run build

echo "Deploying files to server..."
scp -r build/* micronet@213.58.235.225:/var/www/main/

echo "I think it is done!"