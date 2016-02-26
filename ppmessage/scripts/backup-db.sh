NOW="`date +%Y%m%d`"
mysqldump -uroot -ptest mdm > db-$NOW.sql
