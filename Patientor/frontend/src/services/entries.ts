import axios from "axios";
import { Entry, EntryWithoutId } from "../types";

import { apiBaseUrl } from "../constants";

const create = async ({ entry, id }: { entry: EntryWithoutId, id: string}): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    entry
  );

  return data;
};

export default {
  create
};

