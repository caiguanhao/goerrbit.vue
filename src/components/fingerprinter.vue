<template>
  <fieldset v-bind:disabled="!currentUser.IsAdmin">
    <div class="form-check">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox" v-model="customFingerprinter">
        <span>Custom Fingerprinter</span>
      </label>
    </div>
  </fieldset>
  <fieldset v-bind:disabled="!currentUser.IsAdmin || !customFingerprinter">
    <div class="form-check">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox"
          v-model="currentFingerprinter.ErrorClass">
        <span>Error Class</span>
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox"
          v-model="currentFingerprinter.Message">
        <span>Message</span>
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox"
          v-model="currentFingerprinter.Component">
        <span>Component</span>
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox"
          v-model="currentFingerprinter.Action">
        <span>Action</span>
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox"
          v-model="currentFingerprinter.EnvironmentName">
        <span>Environment Name</span>
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label">
        <input class="form-check-input" type="checkbox"
          v-model="useBacktrace">
        <span>Backtrace</span>
      </label>
    </div>
    <fieldset class="next" v-bind:disabled="!useBacktrace">
      <div class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="radio"
            v-bind:value="true" v-model="allLines">
          <span>Every Line</span>
        </label>
      </div>
      <div class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="radio"
            v-bind:value="false" v-model="allLines">
            <span>Only First</span>
            <input class="form-control form-control-sm lines mx-2"
              type="number" min="1" max="99" step="1"
              v-model.number="lines">
            <span v-text="lines > 1 ? 'Lines' : 'Line'"></span>
        </label>
      </div>
    </fieldset>
  </fieldset>
</template>

<script>
export default {
  props: {
    obj: Object
  },
  computed: {
    currentFingerprinter () {
      if (this.obj.Fingerprinter) {
        return this.obj.Fingerprinter
      }
      return this.obj.ActualFingerprinter
    },
    customFingerprinter: {
      get () {
        return !!this.obj.Fingerprinter
      },
      set (val) {
        if (val) {
          this.obj.Fingerprinter = JSON.parse(JSON.stringify(this.obj.ActualFingerprinter))
        } else {
          this.obj.Fingerprinter = null
        }
      }
    },
    useBacktrace: {
      get () {
        return this.currentFingerprinter.BacktraceLines !== 0
      },
      set (value) {
        this.currentFingerprinter.BacktraceLines = value ? -1 : 0
      }
    },
    allLines: {
      get () {
        return this.currentFingerprinter.BacktraceLines < 1
      },
      set (value) {
        this.currentFingerprinter.BacktraceLines = value ? -1 : 5
      }
    },
    lines: {
      get () {
        let lines = this.currentFingerprinter.BacktraceLines
        return lines < 1 ? 5 : lines
      },
      set (lines) {
        this.currentFingerprinter.BacktraceLines = lines
      }
    }
  }
}
</script>

<style scoped>
.next {
  margin-left: 1.5em;
}

.lines {
  display: inline;
  width: 60px;
  padding-top: 0;
  padding-bottom: 0;
  min-height: auto;
}
</style>
