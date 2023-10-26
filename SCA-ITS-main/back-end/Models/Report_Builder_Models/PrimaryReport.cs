using SCA_ITS_back_end.DB_Models;

namespace SCA_ITS_back_end.Models;

public class PrimaryReport
{
    public string lastname { get; set; }
    public string firstname { get; set; }
    public string grade { get; set; }
    public string date { get; set; }
    public int promotionalLength { get; set; }
    public int nonPromotionalLength { get; set; }
    public List<string> coreSubjects { get; set; }
    public List<string> vocationalSubjects { get; set; }
    public List<string> supportSubjects { get; set; }

    public List<PrimaryReportTermRow> termRows { get; set; }

    public string daysAbsent { get; set; }
    public string progressReportComments { get; set; }

    public string term { get; set; }
    public string year { get; set; }
    public List<Tuple<string, string>> courseRemarks { get; set; }

    public Tuple<int, List<PrimaryReportPersonaCategory>> personaGrades { get; set; }

    public string briefComments { get; set; }

    private static List<int> gradeThresholds = new List<int>() { 80, 70, 60, 50, 40 };
    private static List<string> letters = new List<string>() { "A", "B", "C", "D", "E" };

    public PrimaryReport(string firstName, string lastName, string grade, string date, int term, string year, int daysAbsent)
    {
        this.firstname = firstName;
        this.lastname = lastName;
        this.grade = grade;
        this.date = date;

        this.coreSubjects = new List<string>();
        this.vocationalSubjects = new List<string>();
        this.supportSubjects = new List<string>();

        this.promotionalLength = 0;
        this.nonPromotionalLength = 0;

        this.termRows = new List<PrimaryReportTermRow>();

        this.progressReportComments = "";
        this.daysAbsent = daysAbsent.ToString();

        this.term = term.ToString();
        this.year = year;
        this.courseRemarks = new List<Tuple<string, string>>();

        this.personaGrades = new Tuple<int, List<PrimaryReportPersonaCategory>>(0, new List<PrimaryReportPersonaCategory>());

        this.briefComments = "";
    }

    //----   ADD CORE SUBJECTS   ----
    public void addCoreSubjects(List<string> subjects)
    {
        this.coreSubjects.AddRange(subjects);
        this.promotionalLength += subjects.Count();
    }

    //----   ADD VOCATIONAL SUBJECTS   ----
    public void addVocationalSubjects(List<string> subjects)
    {
        this.vocationalSubjects.AddRange(subjects);
        this.promotionalLength += subjects.Count();
    }

    //----   ADD SUPPORT SUBJECTS   ----
    public void addSupportSubjects(List<string> subjects)
    {
        this.supportSubjects.AddRange(subjects);
        this.nonPromotionalLength += subjects.Count();
    }

    //----   SET EMPTY VALUES   ----
    private void setEmptyValues()
    {
        // set subjects
        if (this.coreSubjects.Count == 0)
        {
            this.coreSubjects.Add("");
            this.promotionalLength += 1;
        }
        if (this.vocationalSubjects.Count == 0)
        {
            this.vocationalSubjects.Add("");
            this.promotionalLength += 1;
        }
        if (this.supportSubjects.Count == 0)
        {
            this.supportSubjects.Add("");
            this.nonPromotionalLength += 1;
        }

    }

    //----   ADD TERM ROW   ----
    public void addTermRow(List<decimal> learnerGrades, List<decimal> classGrades, int term)
    {

        if (learnerGrades.Count == 0 || classGrades.Count == 0)
        {
            return;
        }

        // calculate averages
        var learnerAverage = learnerGrades.Sum() / learnerGrades.Count;
        var classAverage = classGrades.Sum() / classGrades.Count;

        // get average letters
        string learnerAverageLetter = getLetterGrades(new List<decimal>() { learnerAverage }).First();
        string classAverageLetter = getLetterGrades(new List<decimal>() { classAverage }).First();

        // get letter grades for learner
        List<string> learnerLetterGrades = getLetterGrades(learnerGrades);

        // get letter grades for class
        List<string> classLetterGrades = getLetterGrades(classGrades);

        this.termRows.Add(new PrimaryReportTermRow()
        {
            term = term,
            learnerGrades = learnerLetterGrades,
            classGrades = classLetterGrades,
            learnerAverage = learnerAverageLetter,
            classAverage = classAverageLetter,
        });
    }


    //----   ADD PROGRESS REPORT COMMENTS   ----
    public void addProgressReportComments(string comment)
    {
        this.progressReportComments = comment;
    }

    //----   GET LETTER GRADES   ----
    private List<string> getLetterGrades(List<decimal> grades)
    {
        List<string> letterGrades = new List<string>();

        grades.ForEach(grade =>
        {
            string letter = "";
            for (int i = 0; i < letters.Count; i++)
            {
                if (grade >= gradeThresholds[i])
                {
                    letter = letters[i];
                    break;
                }
            }
            if (letter.Length == 0)
            {
                letter = "U";
            }

            letterGrades.Add(letter);
        });

        return letterGrades;
    }

    //----   ADD COURSE REMARKS   ----
    public void addCourseRemarks(List<ReportCourseRemark> courseRemarks)
    {
        courseRemarks.ForEach(remark =>
        {
            this.courseRemarks.Add(new Tuple<string, string>(remark.CourseName, remark.Remark));
        });
    }

    //----   ADD PERSONA MARKS   ----
    public void addPersonaMarks(List<PersonaCategory> categories, List<Persona> personas, List<PersonaGrade> personaGrades, int terms)
    {
        var personaGradesToSave = new List<PrimaryReportPersonaCategory>();

        categories.ForEach(cat =>
        {

            var category = new PrimaryReportPersonaCategory()
            {
                category = cat.Name,
                personas = new List<PrimaryReportPersonaMark>()
            };

            // get personas belonging to category
            var catPersonas = personas.Where(p => p.PersonaCategoryId == cat.Id).Select(
                p => new
                {
                    personaId = p.Id,
                    personaName = p.Name,
                    marks = new List<string>()
                }
            ).ToList();

            /*
                get marks for all terms of personas.
                If there are terms that were not filled in,
                add an empty string for those terms
            */
            for (int i = 0; i < catPersonas.Count; i++)
            {
                var populatedMarks = personaGrades.Where(pg => pg.PersonaId == catPersonas[i].personaId && pg.Term <= terms).OrderBy(pg => pg.Term).ToList();
                var filledMarks = new List<string>();
                for (int term = 1; term <= terms; term++)
                {
                    var mark = populatedMarks.Find(m => m.Term == term);
                    if (mark is null)
                    {
                        filledMarks.Add("");
                        continue;
                    }
                    filledMarks.Add(mark.Grade);
                }
                catPersonas[i].marks.AddRange(filledMarks);
            }

            category.personas.AddRange(catPersonas.Select(p => new PrimaryReportPersonaMark() { personaName = p.personaName, marks = p.marks }));
            personaGradesToSave.Add(category);
        });

        this.personaGrades = new Tuple<int, List<PrimaryReportPersonaCategory>>(terms, personaGradesToSave);
    }

    //----   ADD BRIEF COMMENTS   ----
    public void addBriefComments(string comment)
    {
        this.briefComments = comment;
    }
}

public class PrimaryReportTermRow
{
    public int term { get; set; }
    public List<string> learnerGrades { get; set; }
    public string learnerAverage { get; set; }
    public List<string> classGrades { get; set; }
    public string classAverage { get; set; }
}

public class PrimaryReportPersonaMark
{
    public string personaName { get; set; }
    public List<string> marks { get; set; }
}

public class PrimaryReportPersonaCategory
{
    public string category { get; set; }
    public List<PrimaryReportPersonaMark> personas { get; set; }
}