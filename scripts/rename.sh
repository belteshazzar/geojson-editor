
IFS=$'\n'

for i in $(ls)
do
  x=$i
  y=$(echo "$i" | sed 's/spain south america/new spain/')
  echo "$x"
  echo "$y"
  mv $x $y 
done

