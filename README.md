#TODO

# user actions

# Login POST /login {username, password}

# returns status 400 if login failed

# Signup POST /signup {username, password}

# Files Actions - userid in header

# userid header - {'Authorization'}

## Info POST /:username/:path/:filename {type:"info"}

## Show POST /:username/:path/file-:filename {type:"show"}

## Rename PATCH /:username/:path/file-:filename {name:newName}

## Copy POST /:username/:path/file-:filename {type:"copy"}

## Move PATCH /:username/:path/file-:filename {path: newPath}

## Delete DELETE /:username/:path/file-:filename

# Folder Actions

## Show POST /:username/:path/folder-:foldername {userid}

## Show POST /:username {userid}

## Enter //same as show different clientside view

## Rename PATCH /:username/:path/folder-:foldername

## Delete DELETE /:username/:path/folder-:foldername

## Up //clientside shows previous folder in path

/username/:folderspath
/username/:foldername/:fileid
/username/:folderspath
/:folderid/:folderid

folder-2314123151
file-2145121421

home/downloads/folder-vscode
