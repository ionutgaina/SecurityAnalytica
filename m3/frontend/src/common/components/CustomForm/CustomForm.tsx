import { ErrorMessage, Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import CustomButton from '../CustomButton/CustomButton';

export interface FormField {
    name: string;
    initialValue: string;
    label: string;
    type: string;
    component?: string;
    CustomStyle?: string;
    placeholder: string;
    validation: any;
  }

interface IFormData {
  title?: string;
  fields: FormField[];
  onSubmit: Function;
  submitButtonText: string;
}

interface IFormError {
  name: string[];
  error: string;
}

export const CustomForm = (data: IFormData): JSX.Element => {
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState<IFormError>({ name: [], error: '' });

  const initialValues: Record<string, string> = {};
  const validationOptions: Record<string, any> = {};

  data.fields.forEach(({ initialValue, validation, name }) => {
    initialValues[name] = initialValue;
    validationOptions[name] = validation;
  });

  return (
    <>
      <div className="card border-0">
        <div className="">
          <h1 className="color-primary">{data?.title}</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationOptions)}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false);
              setDisabled(true);
              try {
                await data.onSubmit(values);
              } catch (e: any) {
                setErrors(e.response.data);
              }
              setDisabled(false);
            }}
          >
            <Form className="m-auto w-full form">
              {data.fields.map(
                ({ name, type, placeholder, label, component, CustomStyle }, index) => (
                  <div key={index} className="d-flex flex-column text-start mb-2">
                    <label htmlFor={name} className="fw-bolder h6 color-secondary">
                      {label}
                    </label>

                    <Field
                      rows={2}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      component={component || 'input'}
                      className={'mb-1 h6 border border-dark p-2 ' + CustomStyle}
                    />

                    {name !== undefined ? (
                      <ErrorMessage className="text-danger mb-1" component="span" name={name} />
                    ) : null}
                    {errors.name !== undefined
                      ? errors.name.map((e: string) => <span key={index}>{e}</span>)
                      : null}
                  </div>
                ),
              )}
              {/* Afișare eroare din backend */}
              {
                <div>
                  <span>{errors.error}</span>
                </div>
              }
              {disabled ? (
                <Spinner style={{ margin: 'auto' }} animation="border" />
              ) : (
                <div className='d-flex justify-content-center'>
                  <CustomButton type="submit" text={data.submitButtonText} />
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};