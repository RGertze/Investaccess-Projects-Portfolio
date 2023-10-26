cd back-end
rm -rf admin-dist
rm -rf staff-dist
rm -rf student-dist
rm -rf parent-dist
cd ..

cd front-end
npm install
npm run build
cp -r dist ../back-end/student-dist
cd ..

cd staff-front-end
npm install
npm run build
cp -r dist ../back-end/staff-dist
cd ..

cd admin-front-end
npm install
npm run build
cp -r dist ../back-end/admin-dist
cd ..

cd parent-front-end
npm install
npm run build
cp -r dist ../back-end/parent-dist
cd ..

cd back-end
npm install
npx tsc
pm2 restart npm