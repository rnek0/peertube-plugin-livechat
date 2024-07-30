// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { html } from 'lit'
import { __ } from 'i18n'

export function tplMucNote (el, note) {
  // eslint-disable-next-line no-undef
  const i18nDelete = __(LOC_moderator_note_delete)

  const aboutOccupant = note.getAboutOccupant()

  return !el.edit
    ? html`
      <div draggable="true" class="note-line draggables-line">
        <div class="note-description">${note.get('description') ?? ''}</div>
        ${
            aboutOccupant
              ? html`
                <livechat-converse-muc-note-occupant
                    .model=${aboutOccupant}
                  ></livechat-converse-muc-note-occupant>`
              : ''
        }
        <button class="note-action" title="${__('Edit')}"
          @click=${el.toggleEdit}
        >
          <converse-icon class="fa fa-edit" size="1em"></converse-icon>
        </button>
        <button class="note-action" title="${i18nDelete}"
          @click=${el.deleteNote}
        >
          <converse-icon class="fa fa-trash-alt" size="1em"></converse-icon>
        </button>
      </div>`
    : html`
      <div class="note-line draggables-line">
        <form class="converse-form" @submit=${el.saveNote}>
          ${
            aboutOccupant
              ? html`
                <livechat-converse-muc-note-occupant
                  full_display=${true}
                  .model=${aboutOccupant}
                ></livechat-converse-muc-note-occupant>
              `
              : ''
          }
          ${_tplNoteForm(note)}
          <fieldset class="form-group">
            <input type="submit" class="btn btn-primary" value="${__('Ok')}" />
            <input type="button" class="btn btn-secondary button-cancel"
              value="${__('Cancel')}" @click=${el.toggleEdit}
            />
          </fieldset>
        </form>
      </div>`
}

function _tplNoteForm (note) {
  // eslint-disable-next-line no-undef
  const i18nNoteDesc = __(LOC_moderator_note_description)

  return html`<fieldset class="form-group">
      <textarea
        class="form-control" name="description"
        placeholder="${i18nNoteDesc}"
      >${note ? note.get('description') : ''}</textarea>
    </fieldset>`
}

function _tplNoteOccupantFormFields (occupant) {
  if (!occupant) { return '' }
  return html`
    <input type="hidden" name="about_nick" value=${occupant.get('nick')} />
    <input type="hidden" name="about_jid" value=${occupant.get('jid')} />
    <input type="hidden" name="about_occupant_id" value=${occupant.get('occupant_id')} />
  `
}

export function tplMucCreateNoteForm (notesEl, occupant) {
  const i18nOk = __('Ok')
  const i18nCancel = __('Cancel')

  return html`
    <form class="notes-create-note converse-form" @submit=${notesEl.submitCreateNote}>
      ${
        occupant
          ? html`
            ${_tplNoteOccupantFormFields(occupant)}
            <livechat-converse-muc-note-occupant
              full_display=${true}
              .model=${occupant}
            ></livechat-converse-muc-note-occupant>
          `
          : ''
      }
      ${_tplNoteForm(undefined)}
      <fieldset class="form-group">
        <input type="submit" class="btn btn-primary" value="${i18nOk}" />
        <input type="button" class="btn btn-secondary button-cancel"
          value="${i18nCancel}" @click=${notesEl.closeCreateNoteForm}
        />
        ${!notesEl.create_note_error_message
          ? ''
          : html`<div class="invalid-feedback d-block">${notesEl.create_note_error_message}</div>`
        }
      </fieldset>
    </form>`
}
