import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'
import { DateTimePicker } from 'react-widgets'

interface IProps extends FieldRenderProps<Date, HTMLElement>,
    FormFieldProps { }

const DateInput: React.FC<IProps> = ({
    input,
    width,
    placeholder,
    date = false,
    time = false,
    meta: { touched, error },
    id,
    ...rest
}) => {
    return <Form.Field error={touched && !!error} width={width}>
        <DateTimePicker
            id={null}
            placeholder={placeholder}
            value={input.value || null}
            onBlur={input.onBlur}
            onKeyDown={(e: { preventDefault: () => any }) => e.preventDefault()}
            onChange={input.onChange}
            date={date}
            time={time}
            {...rest}
        />
        {touched && error && (
            <Label basic color='red'>
                {error}
            </Label>
        )}
    </Form.Field>

}

export default DateInput