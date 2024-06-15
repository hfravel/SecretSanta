package util;

import hashed.HashedPerson;

import java.util.Arrays;
import java.util.HashMap;

public class StringUtil
{
    public static String[] stringToStringList(String string, char delimiter) throws FailedGenerationException
    {
        int size = 1;
        for (int i = 0; i < string.length(); i++)
        {
            if (string.charAt(i) == delimiter)
                size++;
        }

        return stringToStringList(string, delimiter, size);
    }

    public static String[] stringToStringList(String string, char delimiter, int size) throws FailedGenerationException
    {
        String[] stringList = new String[size];
        int count = 0;
        int previous = 0;

        for (int i = 0; i < string.length(); i++)
        {
            if (string.charAt(i) == delimiter)
            {
                if (previous == i)
                    throw new FailedGenerationException("You put two spaces in a row");
                if (count >= size)
                    throw new FailedGenerationException("Too many people: You typed " + count + " people but needed to " + size);

                stringList[count++] = string.substring(previous, i);
                previous = i + 1;
            }
        }
        stringList[count++] = string.substring(previous);

        if (count != size)
            throw new FailedGenerationException("Too few people: You typed " + count + " people but needed to " + size);

        System.out.println(Arrays.toString(stringList));
        return stringList;
    }
}
