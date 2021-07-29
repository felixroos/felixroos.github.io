import React from "react"
import { useFormik, Formik, Form, useFormikContext } from "formik"
import TextField from "@material-ui/core/TextField"

const formikConfig = {
  initialValues: {
    firstName: "",
    lastName: "",
    email: "",
  },
  onSubmit: (values, actions) => {
    alert(JSON.stringify(values))
    actions.resetForm({
      values: {
        firstName: "form",
        lastName: "reset",
        email: "hihi@gege.de",
      },
    })
  },
}

export function FormikWithContext() {
  return (
    <Formik {...formikConfig}>
      <Form>
        <FormikState /><br/>
        <FormikField label="Vorname" name="firstName" /><br/>
        <FormikField label="Nachname" name="lastName" /><br/>
        <FormikField label="Mail" name="email" /><br/>
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  )
}

export function FormikWithChildrenFunction() {
  return (
    <Formik {...formikConfig}>
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          {JSON.stringify(formik.values)}<br/>
          <TextField label="Vorname" {...controlField("firstName", formik)} /><br/>
          <TextField label="Nachname" {...controlField("lastName", formik)} /><br/>
          <FormikField label="Mail" name="email" placeholder="Mail" /><br/>
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  )
}

export function FormikWithHook() {
  const formikHook = useFormik(formikConfig)
  return (
    <form onSubmit={formikHook.handleSubmit}>
      {JSON.stringify(formikHook.values)}<br/>
      <TextField label="Vorname" {...controlField("firstName", formikHook)} /><br/>
      <TextField label="Nachname" {...controlField("lastName", formikHook)} /><br/>
      <TextField
        type="email"
        label="Mail"
        {...controlField("email", formikHook)}
      /><br/>
      <button type="submit">Submit</button>
    </form>
  )
}

function controlField(name, { handleChange, values }) {
  return {
    onChange: handleChange,
    value: values[name],
    name,
  }
}

function FormikField(props) {
  const { name, type } = props
  const { values, handleChange } = useFormikContext()
  // TBD switch on type, adapt change handler
  return (
    <TextField {...controlField(name, { values, handleChange })} {...props} />
  )
}

function FormikState() {
  const { values, handleChange } = useFormikContext()
  return <>{JSON.stringify(values)}</>
}
