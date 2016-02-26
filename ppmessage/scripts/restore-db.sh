NOW="`date +%Y%m%d`"
mysql -uroot -ptest mdm < db-$NOW.sql
