import { format } from 'date-fns';
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../models/activity'

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted by Raj
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>

            </Segment>
            <Segment>
                <Icon name='clock' />{format(activity.date,'h:mm a')}
                <Icon name='marker' />{activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    floated='right'
                    content='View'
                    color='blue'
                    />
            </Segment>
        </Segment.Group>

    )
};

export default ActivityListItem;