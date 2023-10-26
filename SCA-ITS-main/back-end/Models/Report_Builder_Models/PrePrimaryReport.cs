
using SCA_ITS_back_end.DB_Models;

namespace SCA_ITS_back_end.Models;

public class PrePrimaryReport
{
    public string year { get; set; }
    public int term { get; set; }
    public string firstname { get; set; }
    public string lastname { get; set; }
    public string age { get; set; }
    public string dob { get; set; }
    public string daysAbsent { get; set; }
    public string remarks { get; set; }
    public List<PrePrimaryDevGroup> developmentGroups { get; set; }

    public PrePrimaryReport(string firstName, string lastName, string age, string dob, int term, string year, int daysAbsent)
    {
        this.year = year;
        this.term = term;
        this.firstname = firstName;
        this.lastname = lastName;
        this.age = age;
        this.dob = dob;
        this.daysAbsent = daysAbsent.ToString();
        this.remarks = "";
    }

    public void addAssessments(List<DevelopmentGroup> devGroups, List<DevelopmentCategory> devCategories, List<DevelopmentAssessment> devAssessments, List<DevelopmentAssessmentGrade> assessmentGrades, int terms)
    {
        var groups = new List<PrePrimaryDevGroup>();

        // create groups
        devGroups.ForEach(dg =>
        {
            var group = new PrePrimaryDevGroup()
            {
                name = dg.Name,
                categories = new List<PrePrimaryDevCategory>()
            };

            var categories = devCategories.Where(dc => dc.GroupId == dg.Id).ToList();

            // create categories for groups
            categories.ForEach(cat =>
            {
                var category = new PrePrimaryDevCategory()
                {
                    name = cat.Name,
                    assessments = new List<PrePrimaryDevAssessment>()
                };

                var assessments = devAssessments.Where(da => da.CategoryId == cat.Id).ToList();

                // create assessments for categories
                assessments.ForEach(ass =>
                {
                    var assessment = new PrePrimaryDevAssessment()
                    {
                        name = ass.Name,
                        marks = new List<string>()
                    };

                    var grades = assessmentGrades.Where(ag => ag.AssessmentId == ass.Id && ag.Term <= terms).OrderBy(ag => ag.Term).ToList();

                    // fill in missing terms with blank space
                    for (int i = 1; i <= terms; i++)
                    {
                        var grade = grades.Find(g => g.Term == i);
                        if (grade is null)
                        {
                            assessment.marks.Add("");
                            continue;
                        }
                        assessment.marks.Add(grade.Grade.ToString());
                    }

                    // add assessments to category
                    category.assessments.Add(assessment);
                });

                // add category to group
                group.categories.Add(category);
            });

            // add group to groups
            groups.Add(group);
        });

        // set development groups
        this.developmentGroups = groups;
    }
}

public class PrePrimaryDevGroup
{
    public string name { get; set; }
    public List<PrePrimaryDevCategory> categories { get; set; }
}

public class PrePrimaryDevCategory
{
    public string name { get; set; }
    public List<PrePrimaryDevAssessment> assessments { get; set; }
}

public class PrePrimaryDevAssessment
{
    public string name { get; set; }
    public List<string> marks { get; set; }
}