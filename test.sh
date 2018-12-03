for dir in ./packages/* ;do
    if [[ -d $dir ]];then
        cd $dir
            echo $PWD
            npm version '0.20.14'
            npm publish --access public
        cd -
    fi
done