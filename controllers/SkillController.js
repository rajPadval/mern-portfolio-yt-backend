const Skill = require("../models/SkillModel");

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    if (!skills)
      return res
        .status(404)
        .json({ success: false, message: "Skills not found" });
    return res.status(200).json({ success: true, skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addSkill = async (req, res) => {
  const { skill, level } = req.body;
  try {
    const newSkill = await Skill.create({ skill, level });
    await newSkill.save();
    return res.status(201).json({ success: true, message: "New skill added" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill)
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    return res.status(200).json({ success: true, message: "Skill deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
