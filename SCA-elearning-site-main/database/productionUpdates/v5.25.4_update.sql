create table Quiz(
    Quiz_ID int primary key auto_increment,
    Course_ID int not null,
    Quiz_Name varchar(200) not null,
    Quiz_Attempts_Allowed int not null,
    Quiz_Opening_Time datetime not null,
    Quiz_Closing_Time datetime not null,
    Quiz_Duration int not null,

    foreign key (Course_ID) references Course(Course_ID)
);

create table Quiz_Question(
    Quiz_Question_ID int primary key auto_increment,
    Quiz_ID int not null,
    Quiz_Question_Type int not null,
    Quiz_Question_Number int not null,
    Quiz_Question_Value varchar(1000) not null,
    Quiz_Question_Marks_Available int not null,
    Quiz_Question_Has_Multiple_Answers bit,

    foreign key (Quiz_ID) references Quiz(Quiz_ID)
);

create table Quiz_Answer(
    Quiz_Answer_ID int primary key auto_increment,
    Quiz_Question_ID int not null,
    Quiz_Answer_Value varchar(500) not null,
    Quiz_Answer_Is_Correct bit not null,

    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID)
);

create table Student_Quiz(  /*----   1   ----*/
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Student_Quiz_Start_Time datetime,
    Student_Quiz_End_Time datetime,
    Student_Quiz_Mark_Obtained decimal(19,2),
    Student_Quiz_Graded bit not null,

    foreign key (Student_ID) references Student(Student_ID),
    foreign key (Quiz_ID) references Quiz(Quiz_ID),

    primary key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number)
);

create table Student_Quiz_Unstructured_Answer(  /*----   2   ----*/
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Quiz_Question_ID int not null,
    Quiz_Answer_ID int not null,

    foreign key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number) references Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number),
    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID),
    foreign key (Quiz_Answer_ID) references Quiz_Answer(Quiz_Answer_ID),

    primary key (Student_ID, Quiz_ID, Quiz_Question_ID, Quiz_Answer_ID, Student_Quiz_Attempt_Number)
);

create table Student_Quiz_Structured_Answer(   /*----   3   ----*/
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Quiz_Question_ID int not null,
    Student_Quiz_Structured_Answer_Value varchar(6000) not null,
    Student_Quiz_Structured_Answer_Mark decimal(19,2),

    foreign key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number) references Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number),
    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID),

    primary key (Student_ID, Quiz_ID, Quiz_Question_ID, Student_Quiz_Attempt_Number)
);

create table Student_Quiz_File(   /*----   4   ----*/
    Student_Quiz_File_Path varchar(500) primary key,
    Student_ID int not null,
    Quiz_ID int not null,
    Student_Quiz_Attempt_Number int not null,
    Quiz_Question_ID int not null,
    Student_Quiz_File_Name varchar(500) not null,

    foreign key (Student_ID, Quiz_ID, Student_Quiz_Attempt_Number) references Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number),
    foreign key (Quiz_Question_ID) references Quiz_Question(Quiz_Question_ID)
);


delimiter //
create procedure sp_addQuiz(
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
create procedure sp_addQuizQuestion(
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
create procedure sp_addQuizAnswer(    /*----   !!   ----*/
    in quizQuestionID int,
    in aValue varchar(500),
    in aIsCorrect bit
)
begin
    if(quizQuestionID in(select Quiz_Question_ID from Quiz_Question) AND aValue!='' AND aIsCorrect is not null ) then

        insert into Quiz_Answer(Quiz_Question_ID, Quiz_Answer_Value, Quiz_Answer_Is_Correct)
        values(quizQuestionID, aValue, aIsCorrect);

        if( (select COUNT(Quiz_Answer_ID) from Quiz_Answer where Quiz_Answer_Is_Correct=1 AND Quiz_Question_ID=quizQuestionID) > 1) then
            update Quiz_Question
            set Quiz_Question_Has_Multiple_Answers=1
            where Quiz_Question_ID=quizQuestionID;
        end if;

        select 'ok' as RESULT;

    else

        select 'quiz question not found or one of the values were empty' as RESULT;

    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuiz(  /*----   4   ----*/
    in studentID int,
    in quizID int
)
begin
    if(studentID in(select Student_ID from Student) AND quizID in(select Quiz_ID from Quiz)) then
        if(now()<=(select Quiz_Closing_Time from Quiz where Quiz_ID=quizID)) then

            if(now()>=(select Quiz_Opening_Time from Quiz where Quiz_ID=quizID)) then
                set @attemptNum=(
                    select (COUNT(Student_ID)+1)
                    from Student_Quiz
                    where Student_ID=studentID AND Quiz_ID=quizID
                );

                insert into Student_Quiz(Student_ID, Quiz_ID, Student_Quiz_Attempt_Number, Student_Quiz_Start_Time, Student_Quiz_End_Time, Student_Quiz_Mark_Obtained, Student_Quiz_Graded)
                values(
                    studentID,
                    quizID,
                    @attemptNum,
                    NOW(),
                    null,
                    0,
                    0
                );

                select 'ok' as RESULT;
            else
                select 'quiz has not yet opened' as RESULT;
            end if;

        else
            select 'quiz closed, no further attempts allowed' as RESULT;
        end if;
    else
        select 'student or quiz does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuizUnstructuredAnswer(  /*----   4   ----*/
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int,
    in ansID int
)
begin
    if(studentID in(select Student_ID from Student_Quiz where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question) AND ansID in(select Quiz_Answer_ID from Quiz_Answer)) then

        call sp_endStudentQuiz(studentID, quizID);

        set @endTime=(select Student_Quiz_End_Time from Student_Quiz where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum);

        if( @endTime is null ) then

            insert into Student_Quiz_Unstructured_Answer(
                Student_ID,
                Quiz_ID,
                Student_Quiz_Attempt_Number,
                Quiz_Question_ID,
                Quiz_Answer_ID
            )
            values(
                studentID,
                quizID,
                attemptNum,
                questID,
                ansID
            );

            select 'ok' as RESULT;
        else
            select 'ATTEMPT_ENDED' as RESULT;
        end if;
    else
        select 'student quiz, question, or answer does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuizStructuredAnswer(  /*----   5   ----*/
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int,
    in ans varchar(6000)
)
begin
    if(studentID in(select Student_ID from Student_Quiz where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question) AND ans != '') then

        call sp_endStudentQuiz(studentID, quizID);

        set @endTime=(select Student_Quiz_End_Time from Student_Quiz where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum);

        if( @endTime is null ) then
            delete from Student_Quiz_Structured_Answer
            where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

            insert into Student_Quiz_Structured_Answer(
                Student_ID,
                Quiz_ID,
                Student_Quiz_Attempt_Number,
                Quiz_Question_ID,
                Student_Quiz_Structured_Answer_Value,
                Student_Quiz_Structured_Answer_Mark
            )
            values(
                studentID,
                quizID,
                attemptNum,
                questID,
                ans,
                0
            );

            select 'ok' as RESULT;
        else
            select 'ATTEMPT_ENDED' as RESULT;
        end if;

    else
        select 'student quiz, or question does not exist or ans is empty' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_addStudentQuizFile(  /*----   6   ----*/
    in filePath varchar(500),
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int,
    in fileName varchar(500)
)
begin
    if(filePath!='' AND fileName!='' AND studentID in(select Student_ID from Student_Quiz where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question)) then

        call sp_endStudentQuiz(studentID, quizID);

        set @endTime=(select Student_Quiz_End_Time from Student_Quiz where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum);

        if( @endTime is null ) then
            insert into Student_Quiz_File(
                Student_Quiz_File_Path,
                Student_ID,
                Quiz_ID,
                Student_Quiz_Attempt_Number,
                Quiz_Question_ID,
                Student_Quiz_File_Name
            )
            values(
                filePath,
                studentID,
                quizID,
                attemptNum,
                questID,
                fileName
            );

            select 'ok' as RESULT;
        else
            insert into Files_To_Delete(File_Path)
            values(filePath);

            select 'ATTEMPT_ENDED' as RESULT;
        end if;

    else
        select 'student quiz, or question does not exist or path or name is empty' as RESULT;
    end if;
end //
delimiter ;


delimiter //
create procedure sp_updateStudentQuizStructuredAnswerMark(  /*----   !!!   ----*/
    in studentID int,
    in quizID int,
    in questID int,
    in attemptNum int,
    in mark decimal(19,2)
)
begin
    if(studentID in(select Student_ID from Student_Quiz_Structured_Answer where Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum) AND questID in(select Quiz_Question_ID from Quiz_Question) AND mark>=0 AND mark<=(select Quiz_Question_Marks_Available from Quiz_Question where Quiz_Question_ID=questID) AND questID in(select Quiz_Question_ID from Quiz_Question)) then

        update Student_Quiz_Structured_Answer
        set Student_Quiz_Structured_Answer_Mark = mark
        where Student_ID = studentID AND Quiz_ID = quizID AND Student_Quiz_Attempt_Number = attemptNum AND Quiz_Question_ID=questID;

        select 'ok' as RESULT;
    else
        select 'student answer does not exist, mark out of range, or question does not exist' as RESULT;
    end if;
end //
delimiter ;


delimiter //
create procedure sp_deleteQuiz(  /*----   !!   ----*/
    quizID int
)
begin
    if(quizID in(select Quiz_ID from Quiz))then

        delete from Student_Quiz_File
        where Quiz_ID=quizID;

        delete from Student_Quiz_Structured_Answer
        where Quiz_ID=quizID;

        delete from Student_Quiz_Unstructured_Answer
        where Quiz_ID=quizID;

        delete from Student_Quiz
        where Quiz_ID=quizID;

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
create procedure sp_deleteQuizQuestion(  /*----   !!   ----*/
    questionID int
)
begin
    if(questionID in(select Quiz_Question_ID from Quiz_Question))then

        delete from Student_Quiz_File
        where Quiz_Question_ID=questionID;

        delete from Student_Quiz_Structured_Answer
        where Quiz_Question_ID=questionID;

        delete from Student_Quiz_Unstructured_Answer
        where Quiz_Question_ID=questionID;

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
create procedure sp_deleteQuizAnswer(  /*----   !!   ----*/
    answerID int
)
begin
    if(answerID in(select Quiz_Answer_ID from Quiz_Answer))then

        delete from Student_Quiz_Unstructured_Answer
        where Quiz_Answer_ID=answerID;

        delete from Quiz_Answer
        where Quiz_Answer_ID=answerID;

        select 'ok' as RESULT;

    else
        select 'quiz answer does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteAllQuestionAnswers(    /*----   !!   ----*/
    studentID int,
    quizID int,
    attemptNum int,
    questID int
)
begin
    if(questID in(select Quiz_Question_ID from Quiz_Question))then

        delete from Student_Quiz_Unstructured_Answer
        where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

        select 'ok' as RESULT;

    else
        select 'quiz question does not exist' as RESULT;
    end if;
end //
delimiter ;

delimiter //
create procedure sp_deleteStudentQuizFile(    /*----   !!   ----*/
    in filePath varchar(500)
)
begin
    if(filePath in(select Student_Quiz_File_Path from Student_Quiz_File)) then
        insert into Files_To_Delete(File_Path)
        values(filePath);

        delete from Student_Quiz_File
        where Student_Quiz_File_Path=filePath;

        select 'ok' as RESULT;
    else
        select 'file does not exist' as RESULT;
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


/*-------------------------------------------------------*/
/*--      GET STUDENT QUIZ ATTEMPTS                      */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizAttempts(
    in studentID int,
    in quizID int
)
begin
    if(studentID in(select Student_ID from Student) AND quizID in(select Quiz_ID from Quiz)) then

        call sp_endStudentQuiz(studentID, quizID);

        set @qDuration = (select Quiz_Duration from Quiz where Quiz_ID=quizID);
        set @qEndTime = (select Quiz_Closing_Time from Quiz where Quiz_ID=quizID);

        select Student_Quiz_Attempt_Number,
        Student_Quiz_Start_Time,
        Student_Quiz_End_Time,
        Student_Quiz_Mark_Obtained,
        Student_Quiz_Graded,
        ( (DATE_ADD(Student_Quiz_Start_Time, interval @qDuration minute) >= now()) AND now() <= @qEndTime AND Student_Quiz_End_Time is null ) as In_Progress
        from Student_Quiz
        where Student_ID=studentID AND Quiz_ID=quizID;

    else

        select 'student or quiz does not exist' as RESULT;

    end if;
end //
delimiter ;


/*-------------------------------------------------------*/
/*--      GET STUDENT QUIZ FILES                         */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizFiles(
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int
)
begin

    select Student_Quiz_File_Path, Student_Quiz_File_Name
    from Student_Quiz_File
    where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET STUDENT UNSTRUCTURED ANSWERS               */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizUnstructuredAnswers(
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int
)
begin

    select Quiz_Answer_ID
    from Student_Quiz_Unstructured_Answer
    where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

end //
delimiter ;



/*-------------------------------------------------------*/
/*--      GET STUDENT STRUCTURED ANSWER                  */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_getStudentQuizStructuredAnswer(
    in studentID int,
    in quizID int,
    in attemptNum int,
    in questID int
)
begin

    select Student_Quiz_Structured_Answer_Value, Student_Quiz_Structured_Answer_Mark
    from Student_Quiz_Structured_Answer
    where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum AND Quiz_Question_ID=questID;

end //
delimiter ;



/*-------------------------------------------------------*/
/*--      END STUDENT QUIZ                               */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_endStudentQuiz(
    in studentID int,
    in quizID int
)
begin

    set @timeNow=now();
    set @endTime=(select Quiz_Closing_Time from Quiz where Quiz_ID=quizID);
    set @duration=(select Quiz_Duration from Quiz where Quiz_ID=quizID);


    if( @timeNow >= @endTime ) then
        update Student_Quiz
        set Student_Quiz_End_Time=@timeNow
        where Quiz_ID=quizID AND Student_Quiz_End_Time is null;
    end if;


    update Student_Quiz
    set Student_Quiz_End_Time=@timeNow
    where DATE_ADD(Student_Quiz_Start_Time, interval @duration minute) <= @timeNow AND Quiz_ID=quizID AND Student_Quiz_End_Time is null;

end //
delimiter ;


/*-------------------------------------------------------*/
/*--      END STUDENT QUIZ ATTEMPT                       */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_endStudentQuizAttempt(
    in studentID int,
    in quizID int,
    in attemptNum int
)
begin
    if(attemptNum in(select Student_Quiz_Attempt_Number from Student_Quiz where Student_ID=studentID AND Quiz_ID=quizID)) then
        update Student_Quiz
        set Student_Quiz_End_Time = now()
        where Quiz_ID=quizID AND Student_ID=studentID AND Student_Quiz_Attempt_Number=attemptNum AND Student_Quiz_End_Time is null;

        select 'ok' as RESULT;
    else
        select 'quiz attempt does not exist' as RESULT;
    end if;
end //
delimiter ;



/*-------------------------------------------------------*/
/*--      CALCULATE STUDENT QUIZ GRADE                   */
/*-------------------------------------------------------*/

delimiter //
create procedure sp_calculateStudentQuizAttemptGrade(
    in studentID int,
    in quizID int,
    in attemptNum int
)
begin

    /* VAR DECLARATIONS */

    declare questionID int;
    declare marksAvailable int;
    declare numOfMultiChoiceCorrectAnswers int;
    declare numOfStudentMultiChoiceCorrectAnswers int;
    declare numOfStudentMultiChoiceAnswers int;
    declare tempCalcVal decimal(19,2);
    declare tempTotal decimal(19,2);
    declare totalMarksObtained decimal(19,2);
    declare END_OF_CURSOR int default false;

    /* CURSOR DECLARATIONS */

    declare Multi_Choice_Questions cursor for
    select Quiz_Question_ID, Quiz_Question_Marks_Available
    from Quiz_Question
    where Quiz_ID=quizID AND Quiz_Question_Type=1;

    declare Single_Word_Questions cursor for
    select Quiz_Question_ID, Quiz_Question_Marks_Available
    from Quiz_Question
    where Quiz_ID=quizID AND Quiz_Question_Type=2;

    /* HANDLER DECLARATIONS */

    declare CONTINUE handler for NOT FOUND set END_OF_CURSOR=true;

    if(attemptNum in(select Student_Quiz_Attempt_Number from Student_Quiz where Student_ID=studentID AND Quiz_ID=quizID)) then

        /* OPEN CURSORS */

        open Multi_Choice_Questions;
        open Single_Word_Questions;

        set totalMarksObtained = 0;

        /* CALCULATE MUTLICHOICE MARKS */

        set tempTotal=0;
        multiChoiceCalcLoop: loop
            fetch Multi_Choice_Questions into questionID, marksAvailable;
            if (END_OF_CURSOR) then
                leave multiChoiceCalcLoop;
            end if;

            set numOfMultiChoiceCorrectAnswers = (
                select COUNT(Quiz_Answer_ID)
                from Quiz_Answer
                where Quiz_Question_ID=questionID AND Quiz_Answer_Is_Correct=1
            ); 

            set numOfStudentMultiChoiceCorrectAnswers = (
                select COUNT(Student_ID) 
                from Student_Quiz_Unstructured_Answer
                where Quiz_Question_ID=questionID 
                AND Quiz_Answer_ID in(select Quiz_Answer_ID from Quiz_Answer where Quiz_Question_ID=questionID AND Quiz_Answer_Is_Correct=1)
                AND Student_Quiz_Attempt_Number=attemptNum
            );

            set numOfStudentMultiChoiceAnswers = (
                select COUNT(Student_ID) 
                from Student_Quiz_Unstructured_Answer
                where Quiz_Question_ID=questionID 
                AND Student_Quiz_Attempt_Number=attemptNum
            );

            if(numOfMultiChoiceCorrectAnswers = 0) then
                set tempCalcVal = marksAvailable;
            else

                /* CHECK IF STUDENT SELECTED MORE THAN THE CORRECT NUMBER OF ANSWERS */

                if(numOfStudentMultiChoiceAnswers > numOfMultiChoiceCorrectAnswers) then
                    set tempCalcVal = 0;
                else
                    set tempCalcVal = (numOfStudentMultiChoiceCorrectAnswers / numOfMultiChoiceCorrectAnswers) * marksAvailable;
                end if;
            end if;

            set tempTotal = tempTotal + tempCalcVal;
        end loop;

        set totalMarksObtained = totalMarksObtained + tempTotal;
        
        /* CALCULATE SINGLE WORD MARKS */

        set tempTotal = 0;
        set END_OF_CURSOR=false;
        singleWordCalcLoop: loop
            fetch Single_Word_Questions into questionID, marksAvailable;
            if (END_OF_CURSOR) then
                leave singleWordCalcLoop;
            end if;

            if((select COUNT(Quiz_Answer_ID) from Quiz_Answer where Quiz_Question_ID=questionID) = 0) then
                set tempCalcVal = marksAvailable;
            else
                if((select Student_Quiz_Structured_Answer_Value from Student_Quiz_Structured_Answer where Quiz_Question_ID=questionID AND Student_Quiz_Attempt_Number=attemptNum limit 1) in(select Quiz_Answer_Value from Quiz_Answer where Quiz_Question_ID=questionID)) then
                    set tempCalcVal = marksAvailable;
                else
                    set tempCalcVal = 0;
                end if;
            end if;

            set tempTotal = tempTotal + tempCalcVal;
        end loop;

        set totalMarksObtained = totalMarksObtained + tempTotal;

        /* CALCULATE STRUCTURED MARKS */

        set tempTotal = (
            select COALESCE(SUM(Student_Quiz_Structured_Answer_Mark),0)
            from Student_Quiz_Structured_Answer
            where Student_Quiz_Attempt_Number=attemptNum
            AND Quiz_Question_ID in(
                select Quiz_Question_ID
                from Quiz_Question
                where Quiz_ID=quizID AND Quiz_Question_Type=3
            )
        );

        set totalMarksObtained = totalMarksObtained + tempTotal;

        /* CLOSE CURSORS */

        close Multi_Choice_Questions;
        close Single_Word_Questions;

        /* UPDATE MARK */

        update Student_Quiz
        set Student_Quiz_Mark_Obtained = totalMarksObtained
        where Student_ID=studentID AND Quiz_ID=quizID AND Student_Quiz_Attempt_Number=attemptNum;

        select 'ok' as RESULT;
    else
        select 'student quiz attempt does not exist' as RESULT;
    end if;
end //
delimiter ;




