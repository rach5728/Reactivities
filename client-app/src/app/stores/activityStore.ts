import { makeAutoObservable} from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../../models/activity";
import agent from "../api/agent";

//configure({ enforceActions: 'always' });

class ActivityStore {
    activityRegistry = new Map();//observable map for mobx
    activities: IActivity[] = [];
    selectedActivity: IActivity | undefined;
    loadingInitial = false;
    editMode = false;
    submitting = false;
    target = '';

    get activitiesByDate() {
        //return this.activities.slice().sort(
        //    (a, b) => Date.parse(a.date) - Date.parse(b.date)
        //);
        return Array.from(this.activityRegistry.values()).slice().sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list()
            //runInAction(() => {
            activities.forEach((activity) => {
                activity.date = activity.date.split('.')[0];
                //this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                //});
                this.loadingInitial = false;
            });
        } catch (error) {
            //runInAction(() => {
            this.loadingInitial = false;
            //})
            console.log(error);

        }
    };

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            this.activityRegistry.set(activity.id, activity);
            //this.activities.push(activity);
            this.editMode = false;
            this.submitting = false;
        } catch (error) {
            console.log(error);
            this.submitting = false;
        }
    };

    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.submitting = false;
        }
        catch (error) {
            console.log(error);
            this.submitting = false;
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

    openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    cancelFormOpen = () => {
        this.editMode = false;
    }

    selectActivity = (id: string) => {
        //this.selectedActivity = this.activities.find(a => a.id === id);
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };

    //need to have this constructor for mobx version>= 6
    constructor() {
        makeAutoObservable(this)
    };
}

export default createContext(new ActivityStore())