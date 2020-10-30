import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import * as Yup from 'yup';
import Orphanage from '../models/Orphanage';
import OrphanageView from '../views/OrphanageView';
import Image from '../models/Image';

export default {

  async show(req: Request, res: Response){

    const { id } = req.params;
    const parsedId = Number.parseInt(id);

    if (isNaN(parsedId)) {
      return res.sendStatus(400);
    }

    const repo = getRepository(Orphanage);
    try {
      const result = await repo.findOneOrFail(parsedId, {
        relations: ['images']
      });
      return res.json(OrphanageView.render(result));
    } catch (error) {
      if (error) {
        if (error instanceof EntityNotFoundError) {
          return res.status(404).json(error);
        }
        return res.status(500).json(error);
      }
      return res.sendStatus(500);
    }
  },

  async index(req: Request, res: Response){
    const repo = getRepository(Orphanage);
    const result = await repo.find({
        relations: ['images']
      });

    return res.json(result);
  },

  async create(req: Request, res: Response){
    const images = (req.files as Express.Multer.File[]).map(file => {
      return { path: file.filename };
    });
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body;

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required()
      }))
    });



    await schema.validate(data, {
      abortEarly: false
    })

    const orphanagesRepo = getRepository(Orphanage);
    const orphanage = orphanagesRepo.create(data);
    await orphanagesRepo.save(orphanage);

    return res.status(201).json(orphanage);
  }
}