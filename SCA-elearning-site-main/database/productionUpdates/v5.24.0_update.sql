/*   source ./database/productionUpdates/v5.24.0_update.sql;   */

use SCA_DB_DEV;

create table Quiz(   /*  -----  1  */
    Quiz_ID int primary key auto_increment,
    Course_ID int not null,
    Quiz_Name varchar(200) not null,
    Quiz_Attempts_Allowed int not null,
    Quiz_Opening_Time datetime not null,
    Quiz_Closing_Time datetime not null,
    Quiz_Duration int not null,

    foreign key (Course_ID) references Course(Course_ID)
);

create table Quiz_Question(   /*  -----  2  */
    Quiz_Question_ID int primary key auto_increment,
    Quiz_ID int not null,
    Quiz_Question_Type int not null,
    Quiz_Question_Number int not null,
    Quiz_Question_Value varchar(1000) not null,
    Quiz_Question_Marks_Available int not null,
    Quiz_Question_Has_Multiple_Answers bit,

    foreign key (Quiz_ID) references Quiz(Quiz_ID)
);

create table Quiz_Answer(   /*  -----  3  */
    Quiz_Answer_ID int primary key auto_increment,
    Quiz_Question_ID int not null,
    Quiz_Answer_Value varchar(500) not null,
    Quiz_Answer_Is_Correct bit not null,

    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID)
);




delimiter //
create procedure sp_addQuiz(   /*  -----  4  */
    in courseID int,
    in qName varchar(200),
    in qAttemptsAllowed int,
    in qOpenTime datetime,
    in qCloseTime datetime,
    in qDuration int
)
begin
    if(courseID in(select Course_ID from Course) AND qName!='' AND qAttemptsAllowed>0 AND qOpenTime is not null AND qCloseTime is not null AND qDuration>0 ) then

        insert into Quiz(Course_ID, Quiz_Name, Quiz_Attempts_Allowed, Quiz_Opening_Time, Quiz_Closing_Time, Quiz_Duration)
        values(courseID, qName, qAttemptsAllowed, qOpenTime, qCloseTime, qDuration);

        select 'ok' as RESULT;

    else

        select 'course not found or one of the values was empty' as RESULT;

    end if;
end //
delimiter ;

delimiter //
create procedure sp_addQuizQuestion(   /*  -----  5  */
    in quizID int,
    in qType int,
    in qValue varchar(1000),
    in qMarksAvail int
)
begin
    if(quizID in(select Quiz_ID from Quiz) AND qType>0 AND qValue!='' AND qMarksAvail>0 ) then

        set @qNum=(select (COUNT(Quiz_Question_ID)+1) from Quiz_Question where Quiz_ID=quizID);

        insert into Quiz_Question(Quiz_ID, Quiz_Question_Type, Quiz_Question_Number, Quiz_Question_Value, Quiz_Question_Marks_Available, Quiz_Question_Has_Multiple_Answers)
        values(quizID, qType, @qNum, qValue, qMarksAvail, 0);

        select 'ok' as RESULT;

    else

        select 'quiz not found, one of the values was empty' as RESULT;

    end if;
end //
delimiter ;

delimiter //
create procedure sp_addQuizAnswer(   /*  -----  6  */
    in quizQuestionID int,
    in aValue varchar(500),
    in aIsCorrect bit
)
begin
    if(quizQuestionID in(select Quiz_Question_ID from Quiz_Question) AND aValue!='' AND aIsCorrect is not null ) then

        insert into Quiz_Answer(Quiz_Question_ID, Quiz_Answer_Value, Quiz_Answer_Is_Correct)
        values(quizQuestionID, aValue, aIsCorrect);

        select 'ok' as RESULT;

    else

        select 'quiz question not found or one of the values were empty' as RESULT;

    end if;
end //
delimiter ;




delimiter //
create procedure sp_deleteQuiz(  /*  -----  7  */
    quizID int
)
begin
    if(quizID in(select Quiz_ID from Quiz))then

        delete from Quiz_Answer
        where Quiz_Question_ID in(
            select Quiz_Question_ID
            from Quiz_Question
            where Quiz_ID=quizID
        );

        delete from Quiz_Question
        where Quiz_ID=quizID;

        delete from Quiz
        where Quiz_ID=quizID;

        select 'ok' as RESULT;

    else
        select 'quiz does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteQuizQuestion(  /*  -----  8  */
    questionID int
)
begin
    if(questionID in(select Quiz_Question_ID from Quiz_Question))then

        delete from Quiz_Answer
        where Quiz_Question_ID=questionID;

        delete from Quiz_Question
        where Quiz_Question_ID=questionID;

        select 'ok' as RESULT;

    else
        select 'quiz question does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteQuizAnswer(   /*  -----  9  */
    answerID int
)
begin
    if(answerID in(select Quiz_Answer_ID from Quiz_Answer))then

        delete from Quiz_Answer
        where Quiz_Answer_ID=answerID;

        select 'ok' as RESULT;

    else
        select 'quiz answer does not exist' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET QUIZZES BY COURSE                          */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getQuizzesByCourse(
    in courseID int
)
begin

    if(courseID in(select Course_ID from Course)) then

        select Quiz_ID, Quiz_Name, Quiz_Opening_Time, Quiz_Closing_Time, Quiz_Duration, (select COALESCE(SUM(Quiz_Question_Marks_Available), 0) from Quiz_Question where Quiz_Question.Quiz_ID=Quiz.Quiz_ID) as Quiz_Marks_Available
        from Quiz
        where Course_ID=courseID;

    else

        select 'course does not exist' as RESULT;

    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET QUIZ QUESTIONS                             */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getQuizQuestions(
    in quizID int
)
begin

    if(quizID in(select Quiz_ID from Quiz)) then

        select Quiz_Question_ID, Quiz_Question_Type, Quiz_Question_Number, Quiz_Question_Value, Quiz_Question_Marks_Available, Quiz_Question_Has_Multiple_Answers
        from Quiz_Question
        where Quiz_ID=quizID;

    else

        select 'quiz does not exist' as RESULT;

    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET QUIZ ANSWERS                               */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getQuizAnswers(
    in quizQuestionID int
)
begin

    if(quizQuestionID in(select Quiz_Question_ID from Quiz_Question)) then

        select Quiz_Answer_ID, Quiz_Answer_Value, Quiz_Answer_Is_Correct
        from Quiz_Answer
        where Quiz_Question_ID=quizQuestionID;

    else

        select 'quiz question does not exist' as RESULT;

    end if;
end //
delimiter ;







