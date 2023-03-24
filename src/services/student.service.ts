import { Transaction } from "sequelize";
import Student from "../interfaces/student";
import StudentRepository from "../repositories/student.repository";
import sequelize from "../config/db.config";

const getStudents = async (): Promise<Student[]> => {
  const students: Student[] = await StudentRepository.getStudents();
  return students;
};

const getStudent = async (id: string): Promise<Student | null> => {
  const student: Student | null = await StudentRepository.getStudent(id);
  return student;
};

const createStudent = async (data: any): Promise<Student> => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const student = await StudentRepository.createStudent(data, transaction);
    await transaction.commit();
    return student;
  } catch (err: any) {
    await transaction.rollback();
    throw err;
  }
};

const updateStudent = async (
  id: string,
  data: any
): Promise<Student | null> => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const student: Student | null = await StudentRepository.updateStudent(
      data,
      id,
      transaction
    );

    if (student) {
      await transaction.commit();
    } else {
      await transaction.rollback();
    }
    return student;
  } catch (err: any) {
    await transaction.rollback();
    throw err;
  }
};

const deleteStudent = async (id: string): Promise<Student | null> => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const student: Student | null = await StudentRepository.deleteStudent(
      id,
      transaction
    );

    if (student) {
      await transaction.commit();
    } else {
      await transaction.rollback();
    }
    return student;
  } catch (err: any) {
    await transaction.rollback();
    throw err;
  }
};

export default {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
