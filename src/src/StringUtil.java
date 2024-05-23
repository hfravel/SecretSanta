import java.util.Arrays;

public class StringUtil
{
    public static String[] stringToStringList(String string, char delimeter)
    {
        int size = 1;
        for (int i = 0; i < string.length(); i++)
        {
            if (string.charAt(i) == delimeter)
                size++;
        }

        String[] stringList = new String[size];
        int count = 0;
        int previous = 0;
        for (int i = 0; i < string.length(); i++)
        {
            if (string.charAt(i) == delimeter)
            {
                stringList[count++] = string.substring(previous, i);
                previous = i + 1;
            }
        }
        stringList[count] = string.substring(previous);

        System.out.println(Arrays.toString(stringList));
        return stringList;
    }
}
