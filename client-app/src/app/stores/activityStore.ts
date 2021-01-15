import { configure, makeAutoObservable, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { history } from "../..";
import { IActivity } from "../../models/activity";
import agent from "../api/agent";

configure({ enforceActions: 'never' });

class ActivityStore {
    activityRegistry = new Map();//observable map for mobx
    activity: IActivity | null = null;
    loadingInitial = false;
    submitting = false;
    target = '';

    get activitiesByDate() {
        //return this.activities.slice().sort(
        //    (a, b) => Date.parse(a.date) - Date.parse(b.date)
        //);
        //return Array.from(this.activityRegistry.values()).slice().sort(
        //    (a, b) => Date.parse(a.date) - Date.parse(b.date)
        //);
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        )
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list()
            //runInAction(() => {
            activities.forEach((activity) => {
                activity.date = new Date(activity.date!);
                //this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                //});
                this.loadingInitial = false;
            });
            //console.log(activities);
        } catch (error) {
            //runInAction(() => {
            this.loadingInitial = false;
            //})
            console.log(error);

        }
    };

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    activity.date = new Date(activity.date);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction(() => {
                    this.loadingInitial = false;
                });
                console.log(error);
            }
        }
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    clearActivity = () => {
        this.activity = null;
    }

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            this.activityRegistry.set(activity.id, activity);
            //this.activities.push(activity);
            this.submitting = false;
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            this.submitting = false;
            toast.error('Problem submiting data!');
            console.log(error);
        }
    };

    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            this.activityRegistry.set(activity.id, activity);
            this.activity = activity;
            this.submitting = false;
            history.push(`/activities/${activity.id}`)
        }
        catch (error) {
            this.submitting = false;
            toast.error('Problem submitting data');
            console.log(error.response);
        }
    }

    deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            this.activityRegistry.delete(id);
            this.submitting = false;
            this.target = '';
        } catch (error) {
            this.submitting = false;
            this.target = '';
            console.log(error);
        }
    }

    //need to have this constructor for mobx version>= 6
    constructor() {
        makeAutoObservable(this)
    };
}

//decorate(ActivityStore, {
//    activityRegistry: observable,
//    activities: observable,
//    selectedActivity: observable,
//    loadingInitial: observable,
//    editMode: observable,
//    submitting: observable,
//    target: observable,
//    activitiesByDate: computed,
//    loadActivities: computed,
//    createActivity: action,
//    editActivity: action,
//    deleteActivity: action,
//    openCreateForm: action,
//    cancelSelectedActivity: action,
//    cancelFormOpen: action,
//    selectActivity: action
//});

export default createContext(new ActivityStore())