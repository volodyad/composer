for dir in ./packages/* ;do
    if [[ -d $dir ]];then
        cd $dir
            echo $PWD
            npm publish --access public
        cd -
    fi
done