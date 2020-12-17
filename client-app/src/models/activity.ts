
//why not use class?- really a blueprint of object and then implement it
//interfaces in typescript do ot appear in complied and built js
//when we just want to define structure of object and have strongly typed object - interface is the way to go
//Interface is solely used for type checking
//less generated code when using interface instead of class
export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    city: string;
    venue: string;
}
