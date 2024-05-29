package crude;

import util.FailedGenerationException;
import util.PeoplePair;
import util.Person;
import util.StringUtil;

import java.util.Random;
import java.util.Scanner;

public class CrudeSecretSantaGenerator
{
    public Person[] people;
    public boolean[][] unavailableLinks;

    public CrudeSecretSantaGenerator(Person[] people)
    {
        this.people = people;
    }

    public PeoplePair[] generatePairs()
    {
        setPeoplesNumbers();
        createPeopleLinks();

        PeoplePair[] peoplePairs = new PeoplePair[people.length];
        for (int i = 0; i < people.length; i++)
        {
            peoplePairs[i] = choosePerson();

            if (peoplePairs[i] != null)
                System.out.println("Pair chosen: Giver = " + peoplePairs[i].giver.name
                        + " and Receiver = " + peoplePairs[i].receiver.name);
            else
                System.out.println("Failed to find " + i + " pair");
        }

        return peoplePairs;
    }

    private void setPeoplesNumbers()
    {
        for (int i = 0; i < people.length; i++)
        {
            people[i].number = i;
        }
    }

    private void createPeopleLinks()
    {
        unavailableLinks = new boolean[people.length][people.length];

        for (int i = 0; i < people.length; i++)
        {
            int totalLinks = 1;
            unavailableLinks[i][i] = true;
            for (int j = 0; j < people[i].links.length; j++)
            {
                totalLinks++;
                unavailableLinks[i][people[i].links[j].number] = true;
            }
            people[i].numAvailable = people.length - totalLinks;
        }
    }

    private PeoplePair choosePerson()
    {
        Person mostRestrictivePerson = people[0];
        for (int i = 1; i < people.length; i++)
        {
            if (people[i].numAvailable == 0)
            {
                System.out.println("numAvail = 0");
                return null;
            }


            if (isMoreRestrictive(mostRestrictivePerson, people[i]))
            {
                mostRestrictivePerson = people[i];
            }
        }

        System.out.println("Pairing: " + mostRestrictivePerson.name + " w/ "
                + mostRestrictivePerson.numAvailable + " available");

        int randomPerson = new Random().nextInt(mostRestrictivePerson.numAvailable);
        PeoplePair peoplePair = null;
        for (int i = 0; i < people.length; i++)
        {
            if (!unavailableLinks[mostRestrictivePerson.number][i])
            {
                if (randomPerson == 0)
                {
                    peoplePair = new PeoplePair(mostRestrictivePerson, people[i]);
                    mostRestrictivePerson.numAvailable = -1;
                    eliminatePerson(i);
                    break;
                }
                else
                    randomPerson--;
            }
        }

        return peoplePair;
    }

    private boolean isMoreRestrictive(Person current, Person next)
    {
        return next.numAvailable > 0 && (current.numAvailable < 0
                || next.numAvailable < current.number);
    }

    private void eliminatePerson(int person)
    {
        for (int i = 0; i < people.length; i++)
        {
            if (!unavailableLinks[i][person])
                people[i].numAvailable--;

            unavailableLinks[i][person] = true;
        }
    }

    public static void resultToString(PeoplePair[] peoplePairs)
    {
        System.out.println("-----Secret Santa Pairs-----");
        for (int i = 0; i < peoplePairs.length; i++)
        {
            System.out.println("Pair " + i + ": " + peoplePairs[i].giver.name + " -> "
                    + peoplePairs[i].receiver.name);
        }
        System.out.println("----------------------------");
    }

    public static void main(String[] args)
    {
        boolean run = true;
        Scanner scan = new Scanner(System.in);
        Person[] people;
        String input;

        while (run)
        {
            System.out.print("Type 'yes' to use default Todd Family and 'quit' to quit: ");
            input = scan.nextLine();
            if (input.equalsIgnoreCase("yes"))
                people = createToddFamily();
            else if (input.equalsIgnoreCase("quit"))
            {
                run = false;
                continue;
            }
            else
                try
                {
                    people = createGroup(scan);
                }
                catch (FailedGenerationException e)
                {
                    System.out.println("Failed to generate Secret Santa List: ");
                    e.printStackTrace();
                    continue;
                }

            CrudeSecretSantaGenerator secretSantaGenerator = new CrudeSecretSantaGenerator(people);
            PeoplePair[] peoplePairs = secretSantaGenerator.generatePairs();
            resultToString(peoplePairs);
        }
    }

    public static Person[] createGroup(Scanner scan) throws FailedGenerationException
    {
        System.out.println("Please enter group members with a space between them: ");
        String group = scan.nextLine();
        String[] groupNames = StringUtil.stringToStringList(group, ' ');

        Person[] people = new Person[groupNames.length];
        for (int i = 0; i < groupNames.length; i++)
        {
            people[i] = new Person(groupNames[i]);
        }

        for (int i = 0; i < people.length; i++)
        {
            System.out.println("Please type the group members who " + people[i].name + " cannot be paired with:");
            String[] links = StringUtil.stringToStringList(scan.nextLine(), ' ');
            matchStringListToPeople(people, i, links);
        }

        return people;
    }

    private static void matchStringListToPeople(Person[] people, int person, String[] links)
    {
        people[person].links = new Person[links.length];

        for (int i = 0; i < people.length; i++)
        {
            if (i == person)
                continue;

            for (int j = 0; j < links.length; j++)
            {
                if (people[i].name.equals(links[j]))
                {
                    people[person].links[j] = people[i];
                }

            }
        }
    }

    public static Person[] createToddFamily()
    {
        Person[] people = new Person[8];
        Person theresa = new Person("Theresa");
        Person gregg = new Person("Gregg");
        theresa.links = new Person[]{gregg};
        gregg.links = new Person[]{theresa};

        Person trish = new Person("Trish");
        Person smitty = new Person("Smitty");
        trish.links = new Person[]{smitty};
        smitty.links = new Person[]{trish};

        Person catherine = new Person("Catherine");
        Person stephany = new Person("Stephany");
        Person maggie = new Person("Maggie");
        Person caroline = new Person("Caroline");

        people[0] = theresa;
        people[1] = gregg;
        people[2] = trish;
        people[3] = smitty;
        people[4] = catherine;
        people[5] = stephany;
        people[6] = maggie;
        people[7] = caroline;

        return people;
    }
}
