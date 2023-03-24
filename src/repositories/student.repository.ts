import { Transaction } from "sequelize";
import Student from "../interfaces/student";
import StudentModel from "../models/student.model";

const getStudents = async (): Promise<Student[]> => {
  const students: Student[] = await StudentModel.findAll();
  return students;
};

const getStudent = async (id: string): Promise<Student | null> => {
  const student: Student | null = await StudentModel.findByPk(id);
  return student;
};

const createStudent = async (
  data: any,
  transaction: Transaction | null = null
) => {
  const student = await StudentModel.create(data, { transaction });
  return student;
};

const updateStudent = async (
  data: any,
  id: string,
  transaction: Transaction | null = null
): Promise<Student | null> => {
  const student = await StudentModel.findByPk(id);
  if (!student) {
    return null;
  }
  const updatedStudent = await student.update(data, { transaction });
  return updatedStudent;
};

const deleteStudent = async (
  id: string,
  transaction: Transaction | null = null
): Promise<Student | null> => {
  const student = await StudentModel.findByPk(id);
  if (!student) {
    return null;
  }
  await student.destroy({ transaction });
  return student;
};

export default {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
