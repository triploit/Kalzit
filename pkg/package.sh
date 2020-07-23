function build {
    bash ./utilities/installer/runLocallyWithoutNodejs.sh --no-link
    cat ./pkg/kalzit-for-tridy.txt > ./kalzit
    chmod +x ./kalzit
}