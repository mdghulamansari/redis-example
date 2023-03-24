import { Request, Response } from "express";
import Student from "../interfaces/student";
import StudentService from "../services/student.service";
import { redisExtensionStore } from "../utils/redisConnection";

export const getStudents = async (req: Request, res: Response) => {
  try {
    const key = `students`;
    const response = await redisExtensionStore.getOrSetCache(key, async () =>
      StudentService.getStudents()
    );
    return res.status(200).json({ data: response, msg: "success" });
  } catch (err: any) {
    return res.status(409).json(err.message);
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ data: [], msg: "Student ID is required" });
    }

    const key = `student_${id}`;
    const response = await redisExtensionStore.getOrSetCache(key, async () =>
      StudentService.getStudent(id)
    );

    if (!response) {
      return res.status(404).json({ data: [], msg: "Student does not exist" });
    }

    return res.status(200).json({ data: response, msg: "success" });
  } catch (err: any) {
    return res.status(500).json({ data: [], msg: err.message });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, age, gender } = req.body;

    if (!name) {
      return res.status(400).json({ data: [], msg: "Name is required" });
    }

    if (!/^[a-z\s]+$/i.test(name)) {
      return res.status(400).json({ data: [], msg: "Name is not valid" });
    }

    if (!age) {
      return res.status(400).json({ data: [], msg: "Age is required" });
    }

    if (!(age > 6 && age < 110)) {
      return res
        .status(400)
        .json({ data: [], msg: "Age should be between 6 to 76" });
    }

    if (!gender) {
      return res.status(400).json({ data: [], msg: "Gander is required" });
    }

    if (!["male", "m", "female", "f"].includes(gender.toLowerCase())) {
      return res
        .status(400)
        .json({ data: [], msg: "Gender should be Male or Female" });
    }

    const student: Student = await StudentService.createStudent({
      name,
      age,
      gender,
    });

    return res.status(201).json({ data: student, msg: "success" });
  } catch (err: any) {
    return res.status(409).json(err.message);
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, gender } = req.body;

    if (!name) {
      return res.status(400).json({ data: [], msg: "Name is required" });
    }

    if (!/^[a-z\s]+$/i.test(name)) {
      return res.status(400).json({ data: [], msg: "Name is not valid" });
    }

    if (!age) {
      return res.status(400).json({ data: [], msg: "Age is required" });
    }

    if (!(age > 6 && age < 110)) {
      return res
        .status(400)
        .json({ data: [], msg: "Age should be between 6 to 76" });
    }

    if (!gender) {
      return res.status(400).json({ data: [], msg: "Gander is required" });
    }

    if (!["male", "m", "female", "f"].includes(gender.toLowerCase())) {
      return res.status(400).json({ data: [], msg: "Must be Male or Female" });
    }

    const response = StudentService.updateStudent(id, {
      name,
      age,
      gender,
    });

    if (!response) {
      return res
        .status(404)
        .json({ data: [], msg: "Student ID does not exist" });
    }

    return res.status(200).json({ data: response, msg: "success" });
  } catch (err: any) {
    return res.status(409).json(err.message);
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const response = await StudentService.deleteStudent(id);
    const key = `student_${id}`;
    // delete store cache
    await redisExtensionStore.deleteCache(key);
    await redisExtensionStore.deleteCache("students");

    if (!response) {
      return res
        .status(404)
        .json({ data: [], msg: "Student ID does not exist" });
    }

    return res.status(200).json({ data: response, msg: "success" });
  } catch (err: any) {
    return res.status(409).json(err.message);
  }
};
