
cd "$(find ~ -type d -name "SCA-elearning-site" -printf '%h' -quit)"
cd ./SCA-elearning-site
pwd

#----------------------------------
#       READ WIDTH
#----------------------------------

read -p "Enter old width: " oldWidth
read -p "Enter new width: " newWidth

echo "----------------------------"
echo "     UPDATING STAFF CSS    "
echo "----------------------------"

cd ./staff-front-end/src

grep -rl "@media (max-width: 600px)" . | xargs sed -i "s/@media (max-width: ${oldWidth}px)/@media (max-width: ${newWidth}px)/g"

echo "...done..."

cd ../../

echo "----------------------------"
echo "     UPDATING PARENT CSS    "
echo "----------------------------"

cd ./parent-front-end/src

grep -rl "@media (max-width: 600px)" . | xargs sed -i "s/@media (max-width: ${oldWidth}px)/@media (max-width: ${newWidth}px)/g"

echo "...done..."

cd ../../

echo "----------------------------"
echo "     UPDATING ADMIN CSS     "
echo "----------------------------"

cd ./admin-front-end/src

grep -rl "@media (max-width: 600px)" . | xargs sed -i "s/@media (max-width: ${oldWidth}px)/@media (max-width: ${newWidth}px)/g"

echo "...done..."

cd ../../

echo "----------------------------"
echo "     UPDATING STUDENT CSS   "
echo "----------------------------"

cd ./front-end/src

grep -rl "@media (max-width: 600px)" . | xargs sed -i "s/@media (max-width: ${oldWidth}px)/@media (max-width: ${newWidth}px)/g"

echo "...done..."

cd ../../

