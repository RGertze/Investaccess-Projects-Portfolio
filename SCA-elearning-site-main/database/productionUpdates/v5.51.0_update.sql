use SCA_DB_DEV;

drop procedure sp_updateQuiz;
delimiter //
create procedure sp_updateQuiz(
    in quizID int,
    in qName varchar(200),
    in qAttemptsAllowed int,
    in qOpenTime datetime,
    in qCloseTime datetime,
    in qDuration int
)
begin
    if(quizID in(select Quiz_ID from Quiz) AND qName !='' AND qAttemptsAllowed>0 AND qOpenTime is not null AND qCloseTime is not null AND qDuration>0 ) then

        update Quiz
        set Quiz_Name=qName, Quiz_Attempts_Allowed=qAttemptsAllowed, Quiz_Opening_Time=qOpenTime, Quiz_Closing_Time=qCloseTime, Quiz_Duration=qDuration
        where Quiz_ID=quizID;

        select 'ok' as RESULT;

    else

        select 'quiz not found or one of the values was empty' as RESULT;

    end if;
end //
delimiter ;

drop procedure sp_getQuizzesByCourse;
delimiter //
create procedure sp_getQuizzesByCourse(
    in courseID int
)
begin

    if(courseID in(select Course_ID from Course)) then

        select Quiz_ID, Quiz_Name, Quiz_Attempts_Allowed, Quiz_Opening_Time, Quiz_Closing_Time, Quiz_Duration, (select COALESCE(SUM(Quiz_Question_Marks_Available), 0) from Quiz_Question where Quiz_Question.Quiz_ID=Quiz.Quiz_ID) as Quiz_Marks_Available
        from Quiz
        where Course_ID=courseID;

    else

        select 'course does not exist' as RESULT;

    end if;
end //
delimiter ;