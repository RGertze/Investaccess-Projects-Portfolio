drop table if exists tasks;
drop table if exists users;

create table users
(
    id         integer primary key auto_increment,
    email      text not null,
    password   text not null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp
);

create table tasks
(
    id           integer primary key auto_increment,
    user_id      integer not null,
    title        text    not null,
    description  text,
    position     integer not null,
    created_at   datetime default current_timestamp,
    updated_at   datetime default current_timestamp,
    completed_at datetime,

    foreign key (user_id) references users (id) on delete cascade
);