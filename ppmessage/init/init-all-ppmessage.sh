python bootstrap/table.py
echo "init db table done"

python bootstrap/bootstrap.py
echo "init db data done"

python create-apns-setting.py
echo "... apns setting"

