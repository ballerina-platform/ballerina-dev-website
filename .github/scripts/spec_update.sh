MODULE_NAME=$1
RELEASE_DATE=$2
echo "Module Name: $MODULE_NAME"

SPEC_MD_FILE="spec.md"
FINAL_MD_FILE="spec/$MODULE_NAME/spec.md"
SPEC_RELEASE_DATE_JSON="_data/spec-release-dates.json"

#rm -f $FINAL_MD_FILE
#
#add_text="---\nlayout: ballerina-stdlib-specs\npermalink: /spec/$MODULE_NAME/\n---\n"
#echo "$(echo $add_text; cat $SPEC_MD_FILE)" > $FINAL_MD_FILE

jq -c ".$MODULE_NAME = \"$RELEASE_DATE\"" $SPEC_RELEASE_DATE_JSON > tmp.$$.json && mv tmp.$$.json $SPEC_RELEASE_DATE_JSON
