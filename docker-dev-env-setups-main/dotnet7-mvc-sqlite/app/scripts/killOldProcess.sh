# find id of process running on port 5000
id=$(lsof -t -i:5000)
kill -9 $id