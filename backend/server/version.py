import re

class Version(object):
    def __init__(self, version:str):
        regex = r'^v(\d+).(\d+).(\d+)(?:-(alpha|beta))?$'
        pattern = re.compile(regex)
        match = pattern.match(version)
        if not match:
            raise ValueError(f"Invalid version string: {version}")
        major, minor, patch, stage = match.groups()
        self.major = int(major)
        self.minor = int(minor)
        self.patch = int(patch)
        self.stage = stage or "final"  # default to final release
        self.stage_order = {"alpha": 0, "beta": 1, "final": 2}

    def __eq__(self, other):
        return (
            self.major == other.major and
            self.minor == other.minor and
            self.patch == other.patch and
            self.stage == other.stage
        )
    
    def __ne__(self, other):
        return not self.__eq__(other)
    
    def __lt__ (self, other):
        if (self.major, self.minor, self.patch) != (other.major, other.minor, other.patch):
            return (self.major, self.minor, self.patch) < (other.major, other.minor, other.patch)
        return self.stage_order[self.stage] < self.stage_order[other.stage]

    def __gt__ (self, other):
        return other.__lt__(self)
    
    def __ge__(self, other):
        return not self.__lt__(other)
    
    def __le__(self, other):
        return not self.__gt__(other)
    
    def __str__(self):
        s = f"v{self.major}.{self.minor}.{self.patch}"
        if self.stage != "final":
            s += f"-{self.stage}"
        return s
    
if __name__ == '__main__':
    n = (Version('v1.3.3'))
    l = (Version('v1.2.3'))
    alpha = (Version('v1.2.3-alpha'))
    beta = (Version('v1.2.3-beta'))
    print(l>n)
    print(alpha<beta)
    print(n, l , alpha, beta)
